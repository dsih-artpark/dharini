import 'dart:io';

import 'package:dartx/dartx_io.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';
import 'package:go_router/go_router.dart';
import 'package:image_picker/image_picker.dart';

class EditProfile extends HookWidget {
  const EditProfile({super.key, required this.profile});
  final UserProfileResponseData? profile;

  @override
  Widget build(BuildContext context) {
    final updateProfile = useUpdateProfile(userId: profile?.id ?? '');
    final queryClient = useQueryClient();

    // Text Editing Controllers
    final firstNameController = useTextEditingController();
    final lastNameController = useTextEditingController();
    final organizationNameController = useTextEditingController();
    final phoneNumberController = useTextEditingController();
    final pickedImage = useState<XFile?>(null);
    final profileImageUrl = useState<String?>(profile?.profilePicture);
    final uploadingImages = useState<Set<String>>({});

    // Initialize controllers with profile data
    useEffect(() {
      firstNameController.text = profile?.firstName ?? '';
      lastNameController.text = profile?.lastName ?? '';
      organizationNameController.text = profile?.project?.name ?? '';
      phoneNumberController.text = profile?.contactNumber ?? '';

      // Dispose controllers on widget disposal
      return () {
        firstNameController.dispose();
        lastNameController.dispose();
        organizationNameController.dispose();
        phoneNumberController.dispose();
      };
    }, [profile]); // Dependency array ensures this runs when profile changes

    // Image upload mutation
    final uploadImagesMutation =
        useUploadImages(onSuccess: (List<String> paths, List<String> urls) {
      uploadingImages.value =
          uploadingImages.value.difference(paths.toSet());
      if (urls.isNotEmpty) {
        profileImageUrl.value = urls.first;
      }
    }, onError: (List<String> paths, String error) {
      uploadingImages.value =
          uploadingImages.value.difference(paths.toSet());
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text('Failed to upload image: $error'),
          backgroundColor: Colors.red,
        ),
      );
    });

    Future<void> pickImage(ImageSource source) async {
      final ImagePicker picker = ImagePicker();
      try {
        final XFile? image = await picker.pickImage(
          source: source,
          imageQuality: 80,
          maxWidth: 800,
          maxHeight: 800,
        );

        if (image != null) {
          uploadingImages.value = {...uploadingImages.value, image.path};
          final file = File(image.path);

          // Upload image and set pickedImage once uploaded
          uploadImagesMutation.mutate(
            [file.path],
          );
        }
      } catch (e) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to pick image: ${e.toString()}'),
              backgroundColor: Colors.red,
            ),
          );
        }
      }
    }

    void removeImage() {
      profileImageUrl.value = null;
    }

    // Function to build Avatar with correct image source
    Widget buildAvatar() {
      // Show uploaded image if available
      if (profileImageUrl.value != null && profileImageUrl.value!.isNotEmpty) {
        return CircleAvatar(
          radius: 45,
          backgroundImage: NetworkImage(profileImageUrl.value ?? ''),
        );
      } else if (pickedImage.value != null) {
        return Container(
          width: 88,
          height: 88,
          decoration: BoxDecoration(
            shape: BoxShape.circle,
            border: Border.all(color: Colors.white, width: 2),
          ),
          child: ClipRRect(
            borderRadius: BorderRadius.circular(9999),
            child: Image.file(
              File(pickedImage.value!.path),
              fit: BoxFit.cover,
              errorBuilder: (context, error, stackTrace) {
                return const Icon(Icons.broken_image, size: 40);
              },
            ),
          ),
        );
      } else if (profile?.profilePicture?.isNotNullOrBlank ?? false) {
        return Avatar(
          size: AvatarSize.large,
          imageUrl: profile?.profilePicture,
        );
      } else {
        return Avatar(
          size: AvatarSize.large,
          imageUrl:
              'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
        );
      }
    }

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
                                Stack(
                                  children: <Widget>[
                                    Center(
                                      child: buildAvatar(),
                                    ),
                                    Positioned(
                                      right: MediaQuery.of(context).size.width *
                                          .35,
                                      bottom: 0,
                                      child: Container(
                                        padding: const EdgeInsets.all(4),
                                        decoration: BoxDecoration(
                                          color: Theme.of(context).primaryColor,
                                          shape: BoxShape.circle,
                                          border: Border.all(
                                            color: Colors.white,
                                            width: 2,
                                          ),
                                        ),
                                        child: InkWell(
                                          onTap: () {
                                            showModalBottomSheet<void>(
                                              context: context,
                                              isScrollControlled: true,
                                              backgroundColor:
                                                  Colors.transparent,
                                              builder: (BuildContext context) =>
                                                  EditProfileSheet(
                                                onTakePhoto: () {
                                                  pickImage(ImageSource.camera);
                                                  Navigator.of(context).pop();
                                                },
                                                onChangePhoto: () {
                                                  pickImage(
                                                      ImageSource.gallery);
                                                  Navigator.of(context).pop();
                                                },
                                                onRemovePhoto: pickedImage
                                                                .value !=
                                                            null ||
                                                        (profile?.profilePicture
                                                                ?.isNotNullOrBlank ??
                                                            false)
                                                    ? () {
                                                        removeImage();
                                                        Navigator.of(context)
                                                            .pop();
                                                      }
                                                    : null,
                                              ),
                                            );
                                          },
                                          child: const Icon(
                                            Icons.edit,
                                            color: Colors.white,
                                            size: 16,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ],
                                ),
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
                                ),
                                SizedBox(
                                  height: Spacing.space(2),
                                ),
                                Text(
                                  'Organization Name',
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
                                  controller: organizationNameController,
                                  enabled: false,
                                ),
                                SizedBox(
                                  height: Spacing.space(4),
                                ),
                              ],
                            ),
                          ),
                        ),
                        SizedBox(
                          height: Spacing.space(2),
                        ),
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
                                  'Contact Information',
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
                                  'Phone Number',
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
                                  controller: phoneNumberController,
                                  enabled: false,
                                ),
                                SizedBox(
                                  height: Spacing.space(2),
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
                      onPressed: () async {
                        final updateUserDto = UpdateUserDtoBuilder()
                          ..firstName = firstNameController.text
                          ..lastName = lastNameController.text;

                        try {
                          await updateProfile.mutate(
                            updateUserDto.build(),
                          );
                          queryClient.invalidateQueries(QueryKeys.profile);
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              const SnackBar(
                                content: Text('Profile updated successfully!'),
                                backgroundColor: Colors.green,
                              ),
                            );
                            context.pop();
                          }
                        } catch (error) {
                          if (context.mounted) {
                            ScaffoldMessenger.of(context).showSnackBar(
                              SnackBar(
                                content: Text(
                                    'Failed to update profile: ${error.toString()}'),
                                backgroundColor: Colors.red,
                              ),
                            );
                          }
                        }
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

// Add the EditProfileSheet widget implementation here

class EditProfileSheet extends StatelessWidget {
  final VoidCallback onTakePhoto;
  final VoidCallback onChangePhoto;
  final VoidCallback? onRemovePhoto;

  const EditProfileSheet({
    Key? key,
    required this.onTakePhoto,
    required this.onChangePhoto,
    this.onRemovePhoto,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.only(top: 12, bottom: 30),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: const BorderRadius.only(
          topLeft: Radius.circular(20),
          topRight: Radius.circular(20),
        ),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        children: <Widget>[
          // Drag handle
          Container(
            width: 40,
            height: 4,
            margin: const EdgeInsets.only(bottom: 12),
            decoration: BoxDecoration(
              color: Colors.grey[300],
              borderRadius: BorderRadius.circular(2),
            ),
          ),

          // Title and Close button
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 20),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(
                  'Profile Photo',
                  style: Theme.of(context).textTheme.titleSmall?.copyWith(
                        fontWeight: FontWeight.w600,
                      ),
                ),
                IconButton(
                  icon: const Icon(Icons.close, size: 24),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ],
            ),
          ),

          const Divider(thickness: 1, height: 1),

          // Take Photo option
          ListTile(
            leading: const Icon(Icons.camera_alt_outlined, size: 26),
            title: const Text('Take Photo'),
            onTap: onTakePhoto,
          ),

          // Choose from gallery option
          ListTile(
            leading: const Icon(Icons.photo_library_outlined, size: 26),
            title: const Text('Choose From Gallery'),
            onTap: onChangePhoto,
          ),

          // Remove photo option (only if applicable)
          if (onRemovePhoto != null)
            ListTile(
              leading:
                  const Icon(Icons.delete_outline, color: Colors.red, size: 26),
              title: const Text(
                'Remove Photo',
                style: TextStyle(color: Colors.red),
              ),
              onTap: onRemovePhoto,
            ),
        ],
      ),
    );
  }
}
