import os
import sys
import tempfile
from pathlib import Path
from unittest import mock

import pytest

sys.path.insert(0, str(Path(__file__).resolve().parent.parent / "api"))

os.environ.setdefault("MISTRAL_API_KEY", "test-key-for-testing")


@pytest.fixture(autouse=True)
def _reset_storage():
    """Force in-memory storage and clear state between tests."""
    import index

    index._db_ready = False
    index._mem.clear()
    yield
    index._mem.clear()


@pytest.fixture()
def use_sqlite(tmp_path):
    """Use a real SQLite database for a test."""
    import index

    db_path = str(tmp_path / "test.db")
    original_path = index.DATABASE_PATH

    index.DATABASE_PATH = db_path
    index._db_ready = None

    yield db_path

    index.DATABASE_PATH = original_path
    index._db_ready = False
    index._mem.clear()
