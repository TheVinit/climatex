#!/usr/bin/env python3
"""
Validation script for KisanSuraksha project setup.
Checks dependencies and basic functionality.
"""

import sys
import os
from pathlib import Path

def check_python_version():
    """Verify Python version is 3.8+"""
    if sys.version_info < (3, 8):
        print(f"❌ Python 3.8+ required (you have {sys.version_info.major}.{sys.version_info.minor})")
        return False
    print(f"✓ Python {sys.version_info.major}.{sys.version_info.minor} OK")
    return True

def check_dependencies():
    """Check if required packages are installed."""
    dependencies = [
        'requests', 'pandas', 'numpy', 'sklearn',
        'flask', 'flask_cors', 'dotenv'
    ]
    # Note: package names vs import names
    # scikit-learn -> import sklearn
    # flask-cors -> import flask_cors
    # python-dotenv -> import dotenv
    
    missing = []
    for dep in dependencies:
        try:
            __import__(dep)
        except ImportError:
            missing.append(dep)
    
    if missing:
        print(f"❌ Missing dependencies: {', '.join(missing)}")
        print("   Run: pip install -r requirements.txt")
        return False
    
    print("✓ All required dependencies installed")
    return True

def check_project_structure():
    """Verify project folder structure."""
    required_files = [
        'config.py', 'data_fetcher.py', 'forecaster.py',
        'api.py', 'main.py', 'requirements.txt', 'README.md'
    ]
    
    missing_files = []
    for file in required_files:
        if not Path(file).exists():
            missing_files.append(file)
    
    if missing_files:
        print(f"❌ Missing files: {', '.join(missing_files)}")
        return False
    
    print("✓ All required files present")
    return True

def check_directories():
    """Ensure required directories exist."""
    dirs = ['data', 'models', '.vscode', '.github']
    
    for dir_name in dirs:
        Path(dir_name).mkdir(exist_ok=True)
    
    print("✓ Project directories initialized")
    return True

def check_imports():
    """Test that main modules can be imported."""
    try:
        import config
        import data_fetcher
        import forecaster
        import api
        print("✓ All modules import successfully")
        return True
    except ImportError as e:
        print(f"❌ Import error: {e}")
        return False

def main():
    """Run all validation checks."""
    print("=" * 50)
    print("KisanSuraksha - Setup Validation")
    print("=" * 50)
    
    checks = [
        ("Python Version", check_python_version),
        ("Dependencies", check_dependencies),
        ("Project Structure", check_project_structure),
        ("Directories", check_directories),
        ("Module Imports", check_imports),
    ]
    
    results = []
    for name, check_fn in checks:
        print(f"\n{name}:")
        try:
            result = check_fn()
            results.append(result)
        except Exception as e:
            print(f"❌ Error: {e}")
            results.append(False)
    
    print("\n" + "=" * 50)
    if all(results):
        print("✓ All validation checks passed!")
        print("\nNext steps:")
        print("1. Configure .env with your DiCRA API key")
        print("2. Run: python main.py fetch")
        print("3. Run: python main.py train")
        print("4. Run: python api.py")
        return 0
    else:
        print("❌ Some validation checks failed. See above for details.")
        return 1

if __name__ == '__main__':
    sys.exit(main())