import 'package:flutter/material.dart';

import '../../design_system.dart';

// Common Sheet Types
enum SheetType { alert, action, edit, confirm, warning }

// Base Sheet Component
class AppSheet extends StatelessWidget {
  const AppSheet({
    super.key,
    this.title,
    this.description,
    this.icon,
    this.iconColor,
    this.actions = const <Widget>[],
    this.type = SheetType.action,
    this.showCloseButton = true,
    this.closeButtonAlignment = Alignment.topRight,
    this.titleAlignment = Alignment.topRight,
    this.discriptionAlignment = Alignment.topRight,
    this.iconAlignment = Alignment.topRight,
  });

  final Widget? title;
  final Widget? description;
  final IconData? icon;
  final Color? iconColor;
  final List<Widget> actions;
  final SheetType type;
  final bool showCloseButton;
  final Alignment closeButtonAlignment;
  final Alignment titleAlignment;
  final Alignment discriptionAlignment;
  final Alignment iconAlignment;

  @override
  Widget build(BuildContext context) => Sheet(
        backgroundColor: Theme.of(context).colorScheme.surface,
        radius: Corners.borderLg,
        padding: EdgeInsets.all(Spacing.space(4)),
        gap: Spacing.space(3),
        child: Column(
          mainAxisSize: MainAxisSize.min,
          children: <Widget>[
            if (showCloseButton)
              Align(
                alignment: closeButtonAlignment,
                child: IconButton(
                  icon: const Icon(Icons.close),
                  onPressed: () => Navigator.of(context).pop(),
                ),
              ),
            if (icon != null) ...<Widget>[
              Align(
                alignment: iconAlignment,
                child: Icon(
                  icon,
                  size: 32,
                  color: iconColor ?? Theme.of(context).colorScheme.primary,
                ),
              ),
              SizedBox(height: Spacing.space(2)),
            ],
            if (title != null)
              Align(
                alignment: titleAlignment,
                child: DefaultTextStyle(
                  style: Theme.of(context).textTheme.titleLarge!,
                  child: title!,
                ),
              ),
            if (description != null)
              Align(
                alignment: discriptionAlignment,
                child: DefaultTextStyle(
                  style: Theme.of(context).textTheme.bodyMedium!,
                  child: description!,
                ),
              ),
            if (actions.isNotEmpty) ...<Widget>[
              SizedBox(height: Spacing.space(2)),
              Column(
                mainAxisSize: MainAxisSize.min,
                children: actions
                    .map(
                      (Widget action) => Padding(
                        padding: EdgeInsets.only(bottom: Spacing.space(2)),
                        child: SizedBox(
                          width: double.infinity,
                          child: action,
                        ),
                      ),
                    )
                    .toList(),
              ),
            ],
          ],
        ),
      );
}

// Delete Confirmation Sheet
class DeleteConfirmationSheet extends StatelessWidget {
  const DeleteConfirmationSheet({
    required this.title,
    required this.onDelete,
    required this.oncancel,
    super.key,
    this.description = 'This action cannot be undone.',
  });

  final String title;
  final String description;
  final VoidCallback onDelete;
  final VoidCallback oncancel;

  @override
  Widget build(BuildContext context) => AppSheet(
        icon: Icons.delete,
        // closeButtonAlignment: Alignment.topRight,
        iconAlignment: Alignment.topLeft,
        iconColor: Theme.of(context).colorScheme.error,
        title: Text(
          title,
          style: Theme.of(context).textTheme.displayMedium,
        ),
        titleAlignment: Alignment.topLeft,
        description: Text(
          description,
          style: Theme.of(context).textTheme.bodyMedium,
        ),
        discriptionAlignment: Alignment.topLeft,
        type: SheetType.confirm,
        showCloseButton: false,
        actions: <Widget>[
          AppButton(
            variant: ButtonVariant.outline,
            onPressed: () => oncancel,
            child: const Text('Cancel'),
          ),
          const SizedBox(
            height: 8,
          ),
          AppButton(
            backgroundColor: AppColors.onErrorLight,
            onPressed: onDelete,
            child: const Text('Delete'),
          ),
          const SizedBox(
            height: 15,
          ),
        ],
      );
}

// Edit Profile Sheet
class EditProfileSheet extends StatelessWidget {
  const EditProfileSheet({
    required this.onTakePhoto,
    required this.onChangePhoto,
    super.key,
  });

  final VoidCallback onTakePhoto;
  final VoidCallback onChangePhoto;

  @override
  Widget build(BuildContext context) => AppSheet(
        showCloseButton: false,
        title: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: <Widget>[
            SizedBox(
              width: MediaQuery.of(context).size.width * .1,
            ),
            Align(
                alignment: Alignment.topCenter,
                child: Text(
                  'Edit Profile Picture',
                  style:Theme.of(context).textTheme.bodyMedium,
                ),),
            IconButton(
              icon: const Icon(Icons.close),
              onPressed: () => Navigator.of(context).pop(),
            ),
          ],
        ),
        type: SheetType.edit,
        actions: <Widget>[
          ColoredBox(
            color: AppColors.editProfilesheetback,
            child: Column(
              children: <Widget>[
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child:  ColoredBox(
                    color: AppColors.white,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                     
                        Padding(
                          padding: const EdgeInsets.only(left: 10),
                          child: DefaultTextStyle(
                              style: Theme.of(context).textTheme.bodyMedium!,
                              child: const Text('Take Photo'),),
                        ),
                        IconButton(
                          icon: const Icon(Icons.camera_alt),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                  ),
                ),
               const SizedBox(height: 10,),
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 10),
                  child: ColoredBox(
                    color: AppColors.white,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: <Widget>[
                  
                        Padding(
                          padding: const EdgeInsets.only(left: 10),
                          child: DefaultTextStyle(
                              style: Theme.of(context).textTheme.bodyMedium!,
                              child: const Text('Change Photo'),),
                        ),
                        IconButton(
                          icon: const Icon(Icons.filter_outlined),
                          onPressed: () => Navigator.of(context).pop(),
                        ),
                      ],
                    ),
                  ),
                ),
              ],
            ),
          ),
        ],
      );
}

// Warning Sheet
class WarningSheet extends StatelessWidget {
  const WarningSheet({
    required this.title,
    required this.description,
    required this.siteName,
    required this.siteDetails,
    required this.onConfirm,
    required this.onCancel,
    super.key,
  });

  final String title;
  final String description;
  final String siteName;
  final String siteDetails;
  final VoidCallback onConfirm;
  final VoidCallback onCancel;

  @override
  Widget build(BuildContext context) => AppSheet(
        icon: Icons.warning,
        iconAlignment: Alignment.topLeft,
        titleAlignment: Alignment.topLeft,
        discriptionAlignment: Alignment.topLeft,
        iconColor: AppColors.errorDark,
        title: Text(
          title,
          style: Theme.of(context).textTheme.displayMedium,
        ),
        description: Text(
          description,
          style: Theme.of(context).textTheme.bodyMedium
              ?.copyWith(color: AppColors.labletestgrey),
        ),
        type: SheetType.warning,
        showCloseButton: false,
        actions: <Widget>[
          Container(
            padding: EdgeInsets.all(Spacing.space(3)),
            decoration: BoxDecoration(
                borderRadius: Corners.borderSm,
                border: Border.all(color: AppColors.borderLight),),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                DefaultTextStyle(
                  style: Theme.of(context).textTheme.bodyMedium!,
                  child: Text(
                    siteName,
                    style: Theme.of(context).textTheme.bodyMedium
                        ?.copyWith(color: AppColors.labletestblack),
                  ),
                ),
                SizedBox(height: Spacing.space(1)),
                DefaultTextStyle(
                  style: Theme.of(context).textTheme.bodyMedium!,
                  child: Text(
                    siteDetails,
                    style: Theme.of(context).textTheme.labelLarge
                        ?.copyWith(color: AppColors.labletestgrey),
                  ),
                ),
                const Divider(color: AppColors.borderLight),
                const SizedBox(
                  height: 10,
                ),
                Row(
                  children: <Widget>[
                    const Icon(
                      Icons.location_on_outlined,
                      color: AppColors.primaryDark,
                    ),
                    DefaultTextStyle(
                        style: Theme.of(context).textTheme.bodyMedium!,
                        child: Text(
                          'Tank Road, Miyapur | 8 km away',
                          style: Theme.of(context).textTheme.labelLarge
                              ?.copyWith(color: AppColors.labletestgrey),
                        ),),
                  ],
                ),
              ],
            ),
          ),
          AppButton(
            onPressed: onCancel,
            child: const Text('No, go back'),
          ),
          AppButton(
            variant: ButtonVariant.outline,
            onPressed: onConfirm,
            child: const Text("Yes, I'm at the right site"),
          ),
        ],
      );
}

// Action Sheet
class ActionSheet extends StatelessWidget {
  const ActionSheet({
    required this.actions,
    super.key,
  });

  final List<ActionSheetItem> actions;

  @override
  Widget build(BuildContext context) => AppSheet(
        showCloseButton: false,
        // type: SheetType.action,
        actions: actions
            .map((ActionSheetItem action) => Padding(
                  padding: const EdgeInsets.all(8),
                  child: Row(
                    children: <Widget>[
                      Icon(action.icon),
                      const SizedBox(
                        width: 5,
                      ),
                      DefaultTextStyle(
                        style: Theme.of(context).textTheme.bodyMedium!,
                        child: Text(
                          action.label,
                          style: Theme.of(context).textTheme.bodySmall
                              ?.copyWith(color: AppColors.labletestblack),
                        ),
                      ),
                    ],
                  ),
                ),)
            .toList(),
      );
}

class ActionSheetItem {
  const ActionSheetItem({
    required this.label,
    required this.icon,
    required this.onPressed,
  });

  final String label;
  final IconData icon;
  final VoidCallback onPressed;
}
