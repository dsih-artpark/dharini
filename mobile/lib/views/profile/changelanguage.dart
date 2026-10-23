import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';

class Changelanguage extends StatelessWidget {
  const Changelanguage({super.key});

  @override
  Widget build(BuildContext context) => SafeArea(
        child: Scaffold(
          appBar: PreferredSize(
            preferredSize: const Size.fromHeight(
              56,
            ), // Set the height you want for the appBar
            child: HeaderNavigation(
              title: 'Change Language',
              prefix: AppButton(
                variant: ButtonVariant.icon,
                size: ButtonSize.sm,
                onPressed: () {
                  Navigator.pop(context);
                },
                child: const Icon(Icons.arrow_back),
              ),
            ),
          ),
          body: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                SizedBox(
                  height: Spacing.space(2),
                ),
                Container(
                  width: MediaQuery.of(context).size.width,
                  color: AppColors.white,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: <Widget>[
                      Padding(
                        padding: Spacing.p(4),
                        child: AppRadioGroup<String>(
                          initialValue: 'option1',
                          items: const <Widget>[
                            AppRadio<String>(
                              value: 'option1',
                              label: Text('English'),
                            ),
                            AppRadio<String>(
                              value: 'option2',
                              label: Text('हिंदी'),
                            ),
                            AppRadio<String>(
                              value: 'option3',
                              label: Text('ಕನ್ನಡ'),
                            ),
                            AppRadio<String>(
                              value: 'option4',
                              label: Text('తెలుగు'),
                            ),
                          ],
                          onChanged: (String? value) {
                            debugPrint('Selected value: $value');
                          },
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),
      );
}
