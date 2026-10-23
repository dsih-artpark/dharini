import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';

void main() {
  const options = <CustomDropdownOption<String>>[
    CustomDropdownOption(id: '1', label: 'Karnataka'),
    CustomDropdownOption(id: '2', label: 'Kerala'),
    CustomDropdownOption(id: '3', label: 'Maharashtra'),
    CustomDropdownOption(id: '4', label: 'Tamil Nadu'),
  ];

  group('filterOptions', () {
    test('blank or whitespace query returns the original list', () {
      expect(filterOptions(options, ''), options);
      expect(filterOptions(options, '   '), options);
    });

    test('matches are case-insensitive substrings of the label', () {
      final result = filterOptions(options, 'kar');
      expect(result.map((o) => o.label), ['Karnataka']);
    });

    test('matches anywhere in the label, not just the start', () {
      final result = filterOptions(options, 'nad');
      expect(result.map((o) => o.label), ['Tamil Nadu']);
    });

    test('returns every option matching the query', () {
      final result = filterOptions(options, 'k');
      expect(result.map((o) => o.label), ['Karnataka', 'Kerala']);
    });

    test('no matches returns an empty list', () {
      expect(filterOptions(options, 'zzz'), isEmpty);
    });

    test('leading/trailing whitespace in the query is ignored', () {
      final result = filterOptions(options, '  kerala  ');
      expect(result.map((o) => o.label), ['Kerala']);
    });
  });

  group('select sheet', () {
    // 7 options — comfortably above the search threshold.
    const manyOptions = <CustomDropdownOption<String>>[
      CustomDropdownOption(id: '1', label: 'Karnataka'),
      CustomDropdownOption(id: '2', label: 'Kerala'),
      CustomDropdownOption(id: '3', label: 'Maharashtra'),
      CustomDropdownOption(id: '4', label: 'Tamil Nadu'),
      CustomDropdownOption(id: '5', label: 'Goa'),
      CustomDropdownOption(id: '6', label: 'Punjab'),
      CustomDropdownOption(id: '7', label: 'Assam'),
    ];

    // 2 options — comfortably below the search threshold.
    const fewOptions = <CustomDropdownOption<String>>[
      CustomDropdownOption(id: '1', label: 'Karnataka'),
      CustomDropdownOption(id: '2', label: 'Kerala'),
    ];

    Widget host(List<CustomDropdownOption<String>> opts) => MaterialApp(
          home: Scaffold(
            body: CustomDropdown<String>(
              label: 'Species',
              hintText: 'Select species',
              options: opts,
              value: null,
              onChanged: (_) {},
            ),
          ),
        );

    testWidgets(
      'long lists show a search field, rendered without a Material ancestor error',
      (tester) async {
        await tester.pumpWidget(host(manyOptions));
        await tester.tap(find.byType(InkWell));
        await tester.pumpAndSettle();

        // The sheet (shown via showGeneralDialog) must have a Material ancestor
        // for its TextField/ListTiles, and the search field must render.
        expect(tester.takeException(), isNull);
        expect(find.byType(TextField), findsOneWidget);
      },
    );

    testWidgets(
      'short lists render as a plain picker with no search field',
      (tester) async {
        await tester.pumpWidget(host(fewOptions));
        await tester.tap(find.byType(InkWell));
        await tester.pumpAndSettle();

        expect(tester.takeException(), isNull);
        expect(find.byType(TextField), findsNothing);
        // Options still render (Material ancestor present for the ListTiles).
        expect(find.text('Kerala'), findsOneWidget);
      },
    );
  });

  group('resolveSheetTitle', () {
    test('uses a meaningful hint over the label', () {
      expect(
        resolveSheetTitle(hintText: 'Choose an animal', label: 'Animal'),
        'Choose an animal',
      );
    });

    test('falls back to the label when the hint is the default', () {
      expect(
        resolveSheetTitle(
          hintText: CustomDropdown.defaultHint,
          label: 'State',
        ),
        'State',
      );
    });

    test('falls back to the label when the hint is empty', () {
      expect(
        resolveSheetTitle(hintText: '   ', label: 'Select Collector'),
        'Select Collector',
      );
    });

    test('uses the hint when neither hint nor label is meaningful', () {
      expect(
        resolveSheetTitle(hintText: CustomDropdown.defaultHint, label: ''),
        CustomDropdown.defaultHint,
      );
    });
  });
}
