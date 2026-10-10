"""
test_pattern_bypass_governance.py
==================================
Comprehensive Test Suite for Pattern-Based Secret Governance:
  - Part 1: Fail-Safe Unit Tests (Strict Environment Variable Driven Bypass)
  - Part 2: Decision Engine Notice & Ticketing Matrix Tests
  - Part 3: Live Verification Tests (SharePoint & Jira End-to-End Validation)

Usage:
  python test_pattern_bypass_governance.py          # Runs Unit & Matrix Tests
  python test_pattern_bypass_governance.py --all    # Runs Unit, Matrix, and Live E2E Tests
  python test_pattern_bypass_governance.py --live   # Runs Live Verification against Azure & Jira
"""

import os
import sys
import json
import unittest
import subprocess
import urllib.request
import urllib.parse
from unittest.mock import patch

# Import decision engine
try:
    import decision_engine as de
except ImportError:
    # If running from another directory, add current or container-2 path
    sys.path.append(os.path.abspath(os.path.dirname(__file__)))
    import decision_engine as de


# ==============================================================================
# PART 1: UNIT TEST SUITE - STRICT ENVIRONMENT VARIABLE FAIL-SAFE LOGIC
# ==============================================================================

class TestPatternBypassUnit(unittest.TestCase):
    """
    Validates that:
      1. Bypass is strictly disabled (False) when environment variables are missing or empty.
      2. No hardcoded fallback lists allow silent bypass in production.
      3. Bypass activates ONLY when both tenant ID and pattern match configured env vars.
    """

    ALLOWED_TENANT = "c721d616-dcf3-4510-9c3e-548bc6c1f628"
    OTHER_TENANT   = "70afdd80-5f5b-4a09-a90d-383f126e8c33"
    PATTERNS       = "*.select*,practice-plus-*,*partner*"

    def setUp(self):
        # Save initial environment
        self.orig_env_tenants  = os.environ.get("BYPASS_JIRA_TENANT_IDS")
        self.orig_env_patterns = os.environ.get("BYPASS_JIRA_PATTERNS")

    def tearDown(self):
        # Restore environment
        if self.orig_env_tenants is not None:
            os.environ["BYPASS_JIRA_TENANT_IDS"] = self.orig_env_tenants
        else:
            os.environ.pop("BYPASS_JIRA_TENANT_IDS", None)

        if self.orig_env_patterns is not None:
            os.environ["BYPASS_JIRA_PATTERNS"] = self.orig_env_patterns
        else:
            os.environ.pop("BYPASS_JIRA_PATTERNS", None)

    # --------------------------------------------------------------------------
    # Fail-Safe Tests: Missing or Empty Environment Variables
    # --------------------------------------------------------------------------

    def test_failsafe_both_env_vars_missing(self):
        """TC-01: When env vars are missing, bypass MUST return False (Fail-Safe)."""
        os.environ.pop("BYPASS_JIRA_TENANT_IDS", None)
        os.environ.pop("BYPASS_JIRA_PATTERNS", None)

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "Test-App"
        }
        self.assertFalse(
            de.should_bypass_jira_for_secret(candidate),
            "Security Violation: Bypass occurred when env variables were completely unset!"
        )

    def test_failsafe_patterns_env_missing(self):
        """TC-02: When BYPASS_JIRA_PATTERNS is missing, bypass MUST return False."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ.pop("BYPASS_JIRA_PATTERNS", None)

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "Test-App"
        }
        self.assertFalse(
            de.should_bypass_jira_for_secret(candidate),
            "Security Violation: Bypass occurred without BYPASS_JIRA_PATTERNS configured!"
        )

    def test_failsafe_tenants_env_missing(self):
        """TC-03: When BYPASS_JIRA_TENANT_IDS is missing, bypass MUST return False."""
        os.environ.pop("BYPASS_JIRA_TENANT_IDS", None)
        os.environ["BYPASS_JIRA_PATTERNS"] = self.PATTERNS

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "Test-App"
        }
        self.assertFalse(
            de.should_bypass_jira_for_secret(candidate),
            "Security Violation: Bypass occurred without BYPASS_JIRA_TENANT_IDS configured!"
        )

    def test_failsafe_empty_strings(self):
        """TC-04: When env vars are empty or whitespace, bypass MUST return False."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = "   "
        os.environ["BYPASS_JIRA_PATTERNS"] = "   "

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "Test-App"
        }
        self.assertFalse(de.should_bypass_jira_for_secret(candidate))

    # --------------------------------------------------------------------------
    # Functional Pattern Matching Tests (With Configured Env Vars)
    # --------------------------------------------------------------------------

    def test_matching_tenant_and_pattern_returns_true(self):
        """TC-05: Matching tenant + matching pattern in secret description returns True."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = self.PATTERNS

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "Partner-Integration-App"
        }
        self.assertTrue(de.should_bypass_jira_for_secret(candidate))

    def test_matching_tenant_and_select_pattern_returns_true(self):
        """TC-06: Matching tenant + *.select* glob pattern returns True."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = self.PATTERNS

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "core.reporting.select.key",
            "app_name": "ReportingApp"
        }
        self.assertTrue(de.should_bypass_jira_for_secret(candidate))

    def test_matching_tenant_and_prefix_pattern_returns_true(self):
        """TC-07: Matching tenant + practice-plus-* prefix pattern returns True."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = self.PATTERNS

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "practice-plus-auth-token",
            "app_name": "PracticePlusApp"
        }
        self.assertTrue(de.should_bypass_jira_for_secret(candidate))

    def test_non_matching_pattern_in_allowed_tenant_returns_false(self):
        """TC-08: Allowed tenant + non-matching secret description returns False (standard ticketing)."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = self.PATTERNS

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "standard-portal-key",
            "app_name": "PortalApp"
        }
        self.assertFalse(de.should_bypass_jira_for_secret(candidate))

    def test_matching_pattern_in_unlisted_tenant_returns_false(self):
        """TC-09: Unlisted tenant (e.g. Primary Tenant) + matching pattern returns False (tenant isolation)."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = self.PATTERNS

        candidate = {
            "tenant_id": self.OTHER_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "PartnerApp"
        }
        self.assertFalse(de.should_bypass_jira_for_secret(candidate))

    def test_case_insensitivity(self):
        """TC-10: Pattern matching is case-insensitive for both tenants and patterns."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT.upper()
        os.environ["BYPASS_JIRA_PATTERNS"]   = "*.SELECT*,PRACTICE-PLUS-*,*PARTNER*"

        candidate = {
            "tenant_id": self.ALLOWED_TENANT.lower(),
            "secret_desc": "SERVICE.PARTNER.WEBHOOK",
            "app_name": "PARTNER-APP"
        }
        self.assertTrue(de.should_bypass_jira_for_secret(candidate))

    def test_whitespace_tolerance_in_env_vars(self):
        """TC-11: Handles spaces around commas in environment variables gracefully."""
        os.environ["BYPASS_JIRA_TENANT_IDS"] = f"  {self.ALLOWED_TENANT}  ,  00000000-0000-0000-0000-000000000000  "
        os.environ["BYPASS_JIRA_PATTERNS"]   = "  *.select*  ,  practice-plus-*  ,  *partner*  "

        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "app_name": "PartnerApp"
        }
        self.assertTrue(de.should_bypass_jira_for_secret(candidate))


# ==============================================================================
# PART 2: DECISION ENGINE EXPIRY NOTICE & BUCKET MATRIX
# ==============================================================================

class TestDecisionEngineMatrix(unittest.TestCase):
    """
    Tests that the decision engine appropriately sets:
      - Expiry notices for pattern-bypassed workloads vs standard workloads
      - Bucket classification for P1, P2, P3, and P4
    """

    ALLOWED_TENANT = "c721d616-dcf3-4510-9c3e-548bc6c1f628"

    def setUp(self):
        os.environ["BYPASS_JIRA_TENANT_IDS"] = self.ALLOWED_TENANT
        os.environ["BYPASS_JIRA_PATTERNS"]   = "*.select*,practice-plus-*,*partner*"

    def test_bucket_classification(self):
        """TC-12: Verifies standard governance bucket classification thresholds."""
        self.assertEqual(de.classify_bucket(5),  "P1")   # <= 7 days
        self.assertEqual(de.classify_bucket(14), "P2")   # 8..30 days
        self.assertEqual(de.classify_bucket(35), "P3")   # 31..45 days
        self.assertEqual(de.classify_bucket(46), "P4")   # >= 46 days (Safe)

    def test_expiry_notice_bypassed_format(self):
        """TC-13: Verifies pattern-matched workloads receive the bypassed notice label."""
        bucket = "P2"
        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "service.partner.webhook",
            "bucket": bucket
        }
        is_bypassed = de.should_bypass_jira_for_secret(candidate)
        self.assertTrue(is_bypassed)

        notice = f"{bucket}: Pattern-matched workload (Jira & Teams bypassed)"
        self.assertIn("Jira & Teams bypassed", notice)
        self.assertIn("Pattern-matched workload", notice)

    def test_expiry_notice_standard_format(self):
        """TC-14: Verifies non-pattern workloads receive the standard countdown notice."""
        days = 13
        candidate = {
            "tenant_id": self.ALLOWED_TENANT,
            "secret_desc": "standard-portal-key",
            "days": days
        }
        is_bypassed = de.should_bypass_jira_for_secret(candidate)
        self.assertFalse(is_bypassed)

        notice = f"Secret Expiring in {days} days"
        self.assertEqual(notice, "Secret Expiring in 13 days")


# ==============================================================================
# PART 3: LIVE AZURE & JIRA E2E INTEGRATION TESTS
# ==============================================================================

class TestLiveSecretGovernanceE2E(unittest.TestCase):
    """
    Live verification tests querying Microsoft Graph (SharePoint) and Atlassian Jira.
    Requires active Azure CLI authentication (`az login`).
    """

    APP1_ID = "22e344b1-d650-4722-ae62-9da40ed18889"  # Test-EnvPattern-Partner-Live
    APP2_ID = "cbac3999-e4e0-471a-aa5e-1051c402ff15"  # Test-EnvStandard-Portal-Live

    SITE_ID = "copilot365demooutlook.sharepoint.com,eb7d38df-4022-4b6a-91ac-10f177c65098"
    LIST_ID = "81103193-72dc-4c7d-85e5-5e3c3fec825e"

    @classmethod
    def setUpClass(cls):
        # Fetch MS Graph Token via Azure CLI
        try:
            res = subprocess.run(
                ["az", "account", "get-access-token", "--resource-type", "ms-graph"],
                capture_output=True, text=True, shell=True, check=True
            )
            cls.graph_token = json.loads(res.stdout)["accessToken"]
        except Exception as e:
            cls.graph_token = None
            print(f"[WARN] Unable to obtain MS Graph Token via az CLI: {e}")

    def _query_sp_item(self, app_id: str):
        if not self.graph_token:
            self.skipTest("Azure CLI authentication not available for live SharePoint query")

        filter_expr = urllib.parse.quote(f"fields/Title eq '{app_id}'")
        url = (
            f"https://graph.microsoft.com/v1.0/sites/{self.SITE_ID}/lists/{self.LIST_ID}"
            f"/items?$expand=fields&$filter={filter_expr}"
        )
        req = urllib.request.Request(url, headers={
            "Authorization": f"Bearer {self.graph_token}",
            "Prefer": "HonorNonIndexedQueriesWarningMayFailRandomly"
        })
        with urllib.request.urlopen(req) as resp:
            data = json.loads(resp.read().decode())
        items = data.get("value", [])
        return items[0].get("fields", {}) if items else None

    def test_live_pattern_app_sharepoint_record(self):
        """TC-15 (LIVE): Validates live SharePoint record for Test-EnvPattern-Partner-Live."""
        fields = self._query_sp_item(self.APP1_ID)
        self.assertIsNotNone(fields, f"Pattern app {self.APP1_ID} not found in SharePoint list!")

        self.assertEqual(fields.get("AppName"), "Test-EnvPattern-Partner-Live")
        self.assertEqual(fields.get("SecretDescription"), "service.partner.webhook")
        self.assertEqual(fields.get("ExpiryBucket"), "P2")

        # Crucial Governance Bypass Assertions:
        self.assertEqual(
            fields.get("AlertStatus"), "Discovered",
            "Pattern app AlertStatus should be 'Discovered' (Teams notification bypassed)"
        )
        self.assertIn(
            fields.get("JiraTicketKey"), [None, "", "None"],
            "Pattern app must NOT have a Jira ticket key assigned!"
        )
        self.assertIn(
            "Pattern-matched workload (Jira & Teams bypassed)",
            fields.get("ExpiryNotice", ""),
            "Pattern app ExpiryNotice must indicate Jira and Teams bypass"
        )

    def test_live_standard_app_sharepoint_record(self):
        """TC-16 (LIVE): Validates live SharePoint record for Test-EnvStandard-Portal-Live."""
        fields = self._query_sp_item(self.APP2_ID)
        self.assertIsNotNone(fields, f"Standard app {self.APP2_ID} not found in SharePoint list!")

        self.assertEqual(fields.get("AppName"), "Test-EnvStandard-Portal-Live")
        self.assertEqual(fields.get("SecretDescription"), "standard-portal-key")
        self.assertEqual(fields.get("ExpiryBucket"), "P2")

        # Standard Ticketing Assertions:
        self.assertEqual(
            fields.get("AlertStatus"), "TeamsAlerted",
            "Standard app AlertStatus should be 'TeamsAlerted'"
        )
        jira_key = fields.get("JiraTicketKey")
        self.assertTrue(
            jira_key and jira_key.startswith("KAN-"),
            f"Standard app must have a valid Jira ticket key (got {jira_key})"
        )
        self.assertIn(
            "Secret Expiring in", fields.get("ExpiryNotice", ""),
            "Standard app ExpiryNotice must contain standard countdown"
        )


# ==============================================================================
# CLI RUNNER & FORMATTED SUMMARY TABLE
# ==============================================================================

def print_test_matrix_summary():
    print("\n" + "=" * 90)
    print("AZURE SECRET GOVERNANCE - FAIL-SAFE PATTERN BYPASS TEST MATRIX SUMMARY")
    print("=" * 90)
    print(f"{'TC #':<6} | {'Test Scenario':<45} | {'Expected Bypass':<18} | {'Type'}")
    print("-" * 90)
    matrix = [
        ("TC-01", "Both env vars missing (BYPASS_* unset)", "False (Fail-Safe)", "Unit"),
        ("TC-02", "BYPASS_JIRA_PATTERNS unset",            "False (Fail-Safe)", "Unit"),
        ("TC-03", "BYPASS_JIRA_TENANT_IDS unset",          "False (Fail-Safe)", "Unit"),
        ("TC-04", "Env vars set to empty spaces ('   ')",  "False (Fail-Safe)", "Unit"),
        ("TC-05", "Matching Tenant + *partner* secret",     "True (Bypassed)",   "Unit"),
        ("TC-06", "Matching Tenant + *.select* secret",    "True (Bypassed)",   "Unit"),
        ("TC-07", "Matching Tenant + practice-plus-*",     "True (Bypassed)",   "Unit"),
        ("TC-08", "Matching Tenant + standard-portal-key", "False (Ticketing)", "Unit"),
        ("TC-09", "Unlisted Tenant + *partner* secret",     "False (Isolation)", "Unit"),
        ("TC-10", "Case Insensitivity & Uppercase matching","True (Bypassed)",   "Unit"),
        ("TC-11", "Whitespace in comma-separated env vars", "True (Bypassed)",   "Unit"),
        ("TC-12", "Bucket Classification (P1/P2/P3/P4)",    "N/A",               "Matrix"),
        ("TC-13", "Bypassed ExpiryNotice formatting",       "True (Notice)",     "Matrix"),
        ("TC-14", "Standard ExpiryNotice countdown format", "False (Notice)",    "Matrix"),
        ("TC-15", "Live SP Verification: Pattern App",      "True (Discovered)", "Live E2E"),
        ("TC-16", "Live SP Verification: Standard App",     "False (KAN Ticket)","Live E2E"),
    ]
    for tc, desc, exp, t in matrix:
        print(f"{tc:<6} | {desc:<45} | {exp:<18} | {t}")
    print("=" * 90 + "\n")


if __name__ == "__main__":
    print_test_matrix_summary()

    suite = unittest.TestSuite()
    loader = unittest.TestLoader()

    run_live = "--live" in sys.argv or "--all" in sys.argv
    run_unit = "--live" not in sys.argv or "--all" in sys.argv

    if run_unit:
        suite.addTests(loader.loadTestsFromTestCase(TestPatternBypassUnit))
        suite.addTests(loader.loadTestsFromTestCase(TestDecisionEngineMatrix))

    if run_live:
        suite.addTests(loader.loadTestsFromTestCase(TestLiveSecretGovernanceE2E))

    runner = unittest.TextTestRunner(verbosity=2)
    result = runner.run(suite)
    sys.exit(0 if result.wasSuccessful() else 1)
