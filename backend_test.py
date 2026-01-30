#!/usr/bin/env python3
"""
React Native Mobile App Structure Validation Test
Tests the Agro Nexis mobile app project structure, imports, and configuration
"""

import os
import json
import sys
from pathlib import Path

class ReactNativeProjectTester:
    def __init__(self):
        self.base_path = Path("/app/mobile")
        self.tests_run = 0
        self.tests_passed = 0
        self.issues = []
        
    def log_test(self, name, passed, details=""):
        """Log test result"""
        self.tests_run += 1
        if passed:
            self.tests_passed += 1
            print(f"✅ {name}")
        else:
            print(f"❌ {name}: {details}")
            self.issues.append(f"{name}: {details}")
        
    def test_project_structure(self):
        """Test basic project structure"""
        print("\n🔍 Testing Project Structure...")
        
        # Essential files
        essential_files = [
            "App.js",
            "package.json", 
            "app.json"
        ]
        
        for file in essential_files:
            file_path = self.base_path / file
            self.log_test(
                f"Essential file exists: {file}",
                file_path.exists(),
                f"Missing {file}"
            )
            
        # Essential directories
        essential_dirs = [
            "src",
            "src/screens",
            "src/components",
            "src/context",
            "src/config",
            "src/services",
            "src/navigation"
        ]
        
        for dir_name in essential_dirs:
            dir_path = self.base_path / dir_name
            self.log_test(
                f"Directory exists: {dir_name}",
                dir_path.exists() and dir_path.is_dir(),
                f"Missing directory {dir_name}"
            )
    
    def test_package_json(self):
        """Test package.json configuration"""
        print("\n🔍 Testing package.json...")
        
        package_file = self.base_path / "package.json"
        if not package_file.exists():
            self.log_test("package.json exists", False, "File not found")
            return
            
        try:
            with open(package_file, 'r') as f:
                package_data = json.load(f)
                
            # Check essential dependencies
            dependencies = package_data.get('dependencies', {})
            required_deps = [
                'expo',
                'react',
                'react-native',
                '@react-navigation/native',
                '@react-navigation/stack',
                '@react-navigation/bottom-tabs',
                '@react-native-async-storage/async-storage',
                'axios'
            ]
            
            for dep in required_deps:
                self.log_test(
                    f"Dependency: {dep}",
                    dep in dependencies,
                    f"Missing dependency {dep}"
                )
                
            # Check scripts
            scripts = package_data.get('scripts', {})
            required_scripts = ['start', 'android', 'ios']
            
            for script in required_scripts:
                self.log_test(
                    f"Script: {script}",
                    script in scripts,
                    f"Missing script {script}"
                )
                
        except json.JSONDecodeError as e:
            self.log_test("package.json valid JSON", False, f"JSON error: {e}")
        except Exception as e:
            self.log_test("package.json readable", False, f"Error: {e}")
    
    def test_app_json(self):
        """Test app.json configuration"""
        print("\n🔍 Testing app.json...")
        
        app_file = self.base_path / "app.json"
        if not app_file.exists():
            self.log_test("app.json exists", False, "File not found")
            return
            
        try:
            with open(app_file, 'r') as f:
                app_data = json.load(f)
                
            expo_config = app_data.get('expo', {})
            
            # Check essential expo configuration
            essential_config = {
                'name': 'Agro Nexis',
                'slug': 'agro-nexis',
                'version': '1.0.0'
            }
            
            for key, expected_value in essential_config.items():
                actual_value = expo_config.get(key)
                self.log_test(
                    f"Expo config {key}",
                    actual_value == expected_value,
                    f"Expected '{expected_value}', got '{actual_value}'"
                )
                
            # Check splash screen color matches theme
            splash = expo_config.get('splash', {})
            splash_bg = splash.get('backgroundColor')
            self.log_test(
                "Splash background color matches theme",
                splash_bg == '#1f4f40',
                f"Expected '#1f4f40', got '{splash_bg}'"
            )
                
        except json.JSONDecodeError as e:
            self.log_test("app.json valid JSON", False, f"JSON error: {e}")
        except Exception as e:
            self.log_test("app.json readable", False, f"Error: {e}")
    
    def test_screen_components(self):
        """Test all required screen components exist"""
        print("\n🔍 Testing Screen Components...")
        
        screens_dir = self.base_path / "src" / "screens"
        required_screens = [
            'HomeScreen.js',
            'ProductsScreen.js', 
            'ProductDetailsScreen.js',
            'CartScreen.js',
            'LoginScreen.js',
            'ProfileScreen.js',
            'AboutScreen.js',
            'ContactScreen.js'
        ]
        
        for screen in required_screens:
            screen_path = screens_dir / screen
            self.log_test(
                f"Screen component: {screen}",
                screen_path.exists(),
                f"Missing screen {screen}"
            )
    
    def test_navigation_setup(self):
        """Test navigation configuration"""
        print("\n🔍 Testing Navigation Setup...")
        
        nav_file = self.base_path / "src" / "navigation" / "AppNavigator.js"
        self.log_test(
            "AppNavigator.js exists",
            nav_file.exists(),
            "Navigation file missing"
        )
        
        if nav_file.exists():
            try:
                with open(nav_file, 'r') as f:
                    nav_content = f.read()
                    
                # Check for essential navigation imports
                required_imports = [
                    '@react-navigation/native',
                    '@react-navigation/bottom-tabs',
                    '@react-navigation/stack'
                ]
                
                for import_name in required_imports:
                    self.log_test(
                        f"Navigation import: {import_name}",
                        import_name in nav_content,
                        f"Missing import {import_name}"
                    )
                    
                # Check for screen imports
                screen_imports = [
                    'HomeScreen',
                    'ProductsScreen',
                    'CartScreen',
                    'LoginScreen'
                ]
                
                for screen in screen_imports:
                    self.log_test(
                        f"Screen import: {screen}",
                        screen in nav_content,
                        f"Missing screen import {screen}"
                    )
                    
            except Exception as e:
                self.log_test("Navigation file readable", False, f"Error: {e}")
    
    def test_context_providers(self):
        """Test context providers"""
        print("\n🔍 Testing Context Providers...")
        
        context_dir = self.base_path / "src" / "context"
        required_contexts = [
            'AuthContext.js',
            'CartContext.js'
        ]
        
        for context in required_contexts:
            context_path = context_dir / context
            self.log_test(
                f"Context provider: {context}",
                context_path.exists(),
                f"Missing context {context}"
            )
            
            if context_path.exists():
                try:
                    with open(context_path, 'r') as f:
                        context_content = f.read()
                        
                    # Check for essential context patterns
                    context_name = context.replace('.js', '')
                    patterns = [
                        f"createContext",
                        f"Provider",
                        f"useContext"
                    ]
                    
                    for pattern in patterns:
                        self.log_test(
                            f"{context_name} has {pattern}",
                            pattern in context_content,
                            f"Missing {pattern} in {context_name}"
                        )
                        
                except Exception as e:
                    self.log_test(f"{context} readable", False, f"Error: {e}")
    
    def test_common_components(self):
        """Test common components"""
        print("\n🔍 Testing Common Components...")
        
        components_dir = self.base_path / "src" / "components" / "common"
        required_components = [
            'Header.js',
            'Button.js',
            'Input.js',
            'Card.js',
            'Loading.js'
        ]
        
        for component in required_components:
            component_path = components_dir / component
            self.log_test(
                f"Common component: {component}",
                component_path.exists(),
                f"Missing component {component}"
            )
    
    def test_api_configuration(self):
        """Test API service configuration"""
        print("\n🔍 Testing API Configuration...")
        
        # Test API config file
        api_config_file = self.base_path / "src" / "config" / "api.js"
        self.log_test(
            "API config file exists",
            api_config_file.exists(),
            "Missing api.js config"
        )
        
        if api_config_file.exists():
            try:
                with open(api_config_file, 'r') as f:
                    api_content = f.read()
                    
                # Check for API base URL
                self.log_test(
                    "API_BASE_URL defined",
                    'API_BASE_URL' in api_content,
                    "Missing API_BASE_URL"
                )
                
                # Check for endpoints object
                self.log_test(
                    "Endpoints object defined",
                    'endpoints' in api_content,
                    "Missing endpoints object"
                )
                
            except Exception as e:
                self.log_test("API config readable", False, f"Error: {e}")
        
        # Test API service file
        api_service_file = self.base_path / "src" / "services" / "api.js"
        self.log_test(
            "API service file exists",
            api_service_file.exists(),
            "Missing api service"
        )
        
        if api_service_file.exists():
            try:
                with open(api_service_file, 'r') as f:
                    service_content = f.read()
                    
                # Check for essential API methods
                api_methods = [
                    'login',
                    'register',
                    'getProducts',
                    'getCategories'
                ]
                
                for method in api_methods:
                    self.log_test(
                        f"API method: {method}",
                        method in service_content,
                        f"Missing API method {method}"
                    )
                    
            except Exception as e:
                self.log_test("API service readable", False, f"Error: {e}")
    
    def test_theme_configuration(self):
        """Test theme configuration"""
        print("\n🔍 Testing Theme Configuration...")
        
        theme_file = self.base_path / "src" / "config" / "theme.js"
        self.log_test(
            "Theme config file exists",
            theme_file.exists(),
            "Missing theme.js"
        )
        
        if theme_file.exists():
            try:
                with open(theme_file, 'r') as f:
                    theme_content = f.read()
                    
                # Check for required theme colors
                required_colors = {
                    '#1f4f40': 'Primary color',
                    '#FF8C00': 'Secondary color'
                }
                
                for color, description in required_colors.items():
                    self.log_test(
                        f"Theme color: {description}",
                        color in theme_content,
                        f"Missing {description} {color}"
                    )
                    
                # Check for theme objects
                theme_objects = ['colors', 'spacing', 'fontSize', 'borderRadius']
                
                for obj in theme_objects:
                    self.log_test(
                        f"Theme object: {obj}",
                        f"export const {obj}" in theme_content,
                        f"Missing theme object {obj}"
                    )
                    
            except Exception as e:
                self.log_test("Theme config readable", False, f"Error: {e}")
    
    def test_app_js_structure(self):
        """Test main App.js structure"""
        print("\n🔍 Testing App.js Structure...")
        
        app_file = self.base_path / "App.js"
        if not app_file.exists():
            self.log_test("App.js exists", False, "File not found")
            return
            
        try:
            with open(app_file, 'r') as f:
                app_content = f.read()
                
            # Check for essential providers
            providers = [
                'AuthProvider',
                'CartProvider',
                'SafeAreaProvider',
                'GestureHandlerRootView'
            ]
            
            for provider in providers:
                self.log_test(
                    f"App.js has {provider}",
                    provider in app_content,
                    f"Missing {provider} wrapper"
                )
                
            # Check for AppNavigator
            self.log_test(
                "App.js includes AppNavigator",
                'AppNavigator' in app_content,
                "Missing AppNavigator component"
            )
            
        except Exception as e:
            self.log_test("App.js readable", False, f"Error: {e}")
    
    def run_all_tests(self):
        """Run all validation tests"""
        print("🚀 Starting React Native Project Structure Validation")
        print(f"📁 Base path: {self.base_path}")
        
        # Run all test categories
        self.test_project_structure()
        self.test_package_json()
        self.test_app_json()
        self.test_app_js_structure()
        self.test_screen_components()
        self.test_navigation_setup()
        self.test_context_providers()
        self.test_common_components()
        self.test_api_configuration()
        self.test_theme_configuration()
        
        # Print summary
        print(f"\n📊 Test Results: {self.tests_passed}/{self.tests_run} passed")
        
        if self.issues:
            print(f"\n❌ Issues Found ({len(self.issues)}):")
            for issue in self.issues:
                print(f"  • {issue}")
        else:
            print("\n✅ All tests passed! React Native project structure is valid.")
        
        return self.tests_passed == self.tests_run

def main():
    """Main test execution"""
    tester = ReactNativeProjectTester()
    success = tester.run_all_tests()
    return 0 if success else 1

if __name__ == "__main__":
    sys.exit(main())