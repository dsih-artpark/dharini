import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

class EditProfile extends HookWidget {
  const EditProfile({super.key, required this.profile});
  final UserProfileResponseData? profile;

  @override
  Widget build(BuildContext context) {
    // fquery's mutate() never rethrows, so success and failure are only
    // reported through these callbacks, not by awaiting mutate().
    final updateProfile = useUpdateProfile(
      onSuccess: () {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Profile updated successfully!'),
              backgroundColor: Colors.green,
            ),
          );
          context.pop();
        }
      },
      onError: (errorMessage) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to update profile: $errorMessage'),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
    );

    // Only the name is shown: PATCH /users/profile saves first/last name but
    // not the phone number or photo, so offering those here only looked
    // editable. useTextEditingController disposes these itself.
    final firstNameController = useTextEditingController();
    final lastNameController = useTextEditingController();

    // Initialize controllers with profile data
    useEffect(() {
      firstNameController.text = profile?.firstName ?? '';
      lastNameController.text = profile?.lastName ?? '';
      return null;
    }, [profile]); // Dependency array ensures this runs when profile changes

    return SafeArea(
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(56),
          child: HeaderNavigation(
            title: 'Edit Profile',
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
        body: SizedBox(
          height: MediaQuery.of(context).size.height,
          child: Column(
            children: <Widget>[
              Expanded(
                child: SingleChildScrollView(
                  child: Padding(
                    padding: Spacing.mb(4), // Add padding for button space
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Container(
                          color: AppColors.white,
                          width: MediaQuery.of(context).size.width,
                          child: Padding(
                            padding: Spacing.px(4),
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: <Widget>[
                                SizedBox(
                                  height: Spacing.space(4),
                                ),
                                Text(
                                  'Personal Information',
                                  style: Theme.of(context)
                                      .textTheme
                                      .displaySmall
                                      ?.copyWith(
                                        color: AppColors.labletestblack,
                                      ),
                                ),
                                SizedBox(
                                  height: Spacing.space(2),
                                ),
                                Text(
                                  'First Name',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.labletestblack,
                                      ),
                                ),
                                AppTextField(
                                  size: InputSize.sm,
                                  obscureText: false,
                                  controller: firstNameController,
                                  validator: (value) =>
                                      (value ?? '').trim().isEmpty
                                          ? 'First name is required'
                                          : null,
                                ),
                                SizedBox(
                                  height: Spacing.space(2),
                                ),
                                Text(
                                  'Last Name',
                                  style: Theme.of(context)
                                      .textTheme
                                      .bodyMedium
                                      ?.copyWith(
                                        color: AppColors.labletestblack,
                                      ),
                                ),
                                AppTextField(
                                  size: InputSize.sm,
                                  obscureText: false,
                                  controller: lastNameController,
                                  validator: (value) =>
                                      (value ?? '').trim().isEmpty
                                          ? 'Last name is required'
                                          : null,
                                ),
                                SizedBox(
                                  height: Spacing.space(4),
                                ),
                              ],
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
              // Fixed bottom buttons
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  boxShadow: <BoxShadow>[
                    BoxShadow(
                      // ignore: deprecated_member_use
                      color: Colors.black.withOpacity(0.1),
                      blurRadius: 4,
                      offset: const Offset(0, -2),
                    ),
                  ],
                ),
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: <Widget>[
                    AppButton(
                      variant: ButtonVariant.outline,
                      onPressed: () {
                        Navigator.pop(context);
                      },
                      child: const Text('Cancel'),
                    ),
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    AppButton(
                      isLoading: updateProfile.isPending,
                      onPressed: () {
                        final firstName = firstNameController.text.trim();
                        final lastName = lastNameController.text.trim();
                        if (firstName.isEmpty || lastName.isEmpty) {
                          ScaffoldMessenger.of(context).showSnackBar(
                            const SnackBar(
                              content: Text(
                                  'First name and last name are required'),
                              backgroundColor: Colors.red,
                            ),
                          );
                          return;
                        }

                        final updateOwnProfileDto = UpdateOwnProfileDtoBuilder()
                          ..firstName = firstName
                          ..lastName = lastName;

                        updateProfile.mutate(updateOwnProfileDto.build());
                      },
                      child: const Text('Save Changes'),
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
}
