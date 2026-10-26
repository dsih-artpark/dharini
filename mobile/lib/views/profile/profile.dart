import 'package:dartx/dartx.dart';
import 'package:design_system/design_system.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:go_router/go_router.dart';

import '../../utils/extensions/go_router.dart';
import 'changelanguage.dart';
import 'profilecontainer.dart';

class Profile extends HookWidget {
  const Profile({super.key});

  @override
  Widget build(BuildContext context) {
    final profile = useProfile();
    final logout = useLogout();

    return SafeArea(
      child: Scaffold(
        appBar: PreferredSize(
          preferredSize: const Size.fromHeight(
            56,
          ), // Set the height you want for the appBar
          child: HeaderNavigation(
            title: 'Profile',
            // prefix: AppButton(
            //   variant: ButtonVariant.icon,
            //   size: ButtonSize.sm,
            //   onPressed: () {},
            //   child: const Icon(Icons.arrow_back),
            // ),
            suffix: AppButton(
              variant: ButtonVariant.icon,
              size: ButtonSize.sm,
              onPressed: () {
                context.push('/EditProfile', extra: {'profile': profile.data});
              },
              child: const Icon(Icons.edit),
            ),
          ),
        ),
        // Scrollable so the Logout tile stays reachable on short screens
        // (small phones, landscape, short laptop/web windows).
        body: SingleChildScrollView(
          padding: EdgeInsets.only(bottom: Spacing.space(4)),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              SizedBox(
                height: Spacing.space(2),
              ),
              ProfileContainer(
                imageUrl: profile.data?.profilePicture ??
                    'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png',
                name: [profile.data?.firstName, profile.data?.lastName]
                    .whereNotNull()
                    .join(" "),
                role: '${profile.data?.roles.firstOrNull?.role?.name}',
              ),
              SizedBox(height: Spacing.space(2)),
              Container(
                color: AppColors.white,
                width: MediaQuery.of(context).size.width,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    SizedBox(
                      height: Spacing.space(4),
                    ),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        'ORGANISATION',
                        style: Theme.of(context)
                            .textTheme
                            .labelLarge
                            ?.copyWith(color: AppColors.labletestgrey),
                      ),
                    ),
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        '${profile.data?.project?.name}',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppColors.labletestblack),
                      ),
                    ),
                    SizedBox(height: Spacing.space(4)),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        'PHONE NUMBER',
                        style: Theme.of(context)
                            .textTheme
                            .labelLarge
                            ?.copyWith(color: AppColors.labletestgrey),
                      ),
                    ),
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        '+91 ${profile.data?.contactNumber}',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppColors.labletestblack),
                      ),
                    ),
                    SizedBox(
                      height: Spacing.space(4),
                    ),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        'EMAIL-ID',
                        style: Theme.of(context)
                            .textTheme
                            .labelLarge
                            ?.copyWith(color: AppColors.labletestgrey),
                      ),
                    ),
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    Padding(
                      padding: Spacing.px(4),
                      child: Text(
                        profile.data?.email ?? '',
                        style: Theme.of(context)
                            .textTheme
                            .bodySmall
                            ?.copyWith(color: AppColors.labletestblack),
                      ),
                    ),
                    SizedBox(
                      height: Spacing.space(4),
                    ),
                  ],
                ),
              ),
              SizedBox(
                height: Spacing.space(2),
              ),
              ListTile(
                tileColor: AppColors.white,
                leading: const Icon(Icons.language),
                // Icon on the left
                title: Text(
                  'Change Language',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.labletestblack),
                ),
                // Main text
                trailing: const Icon(Icons.chevron_right),
                // Icon on the right
                onTap: () {
                  Navigator.push<Changelanguage>(
                    context,
                    MaterialPageRoute<Changelanguage>(
                      builder: (BuildContext context) => const Changelanguage(),
                    ),
                  );
                },
              ),
              ListTile(
                tileColor: AppColors.white,
                leading: const Icon(Icons.swap_horiz),
                title: Text(
                  'Switch Project',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: AppColors.labletestblack),
                ),
                trailing: const Icon(Icons.chevron_right),
                onTap: () {
                  context.push('/select-project');
                },
              ),
              ListTile(
                tileColor: AppColors.white,
                leading: const Icon(Icons.logout, color: Colors.red),
                title: Text(
                  'Logout',
                  style: Theme.of(context)
                      .textTheme
                      .bodyMedium
                      ?.copyWith(color: Colors.red),
                ),
                onTap: () async {
                  await logout.mutate(null);
                  if (context.mounted) {
                    context.go('/auth/login');
                  }
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
