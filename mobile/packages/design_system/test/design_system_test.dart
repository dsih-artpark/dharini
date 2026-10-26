// ignore_for_file: always_specify_types

import 'package:design_system/design_system.dart';
import 'package:flutter_test/flutter_test.dart';

void main() {
  test('AppBottomNavBar', () {
    expect(
      const AppBottomNavBar(activeIndex: 0, navigationItems: []),
      isNotNull,
    );
  });
}
