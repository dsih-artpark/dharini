import 'package:design_system/design_system.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:nested/nested.dart';
import 'package:repository/repository.dart';
import 'router.dart';
import 'package:flutter/foundation.dart';

class ESApp extends StatelessWidget {
  const ESApp({
    required this.userRepository,
    required this.projectRepository,
    required this.siteRepository,
    required this.inviteRepository,
    required this.visitRepository,
    super.key,
  });

  final UserRepository userRepository;
  final ProjectRepository projectRepository;
  final SiteRepository siteRepository;
  final InviteRepository inviteRepository;
  final VisitRepository visitRepository;

  @override
  Widget build(BuildContext context) => MultiRepositoryProvider(
        providers: <SingleChildWidget>[
          RepositoryProvider.value(value: userRepository),
          RepositoryProvider.value(value: projectRepository),
          RepositoryProvider.value(value: siteRepository),
          RepositoryProvider.value(value: inviteRepository),
          RepositoryProvider.value(value: visitRepository),
        ],
        child: const AppView(),
      );
}

class AppView extends StatelessWidget {
  const AppView({super.key});

  @override
  Widget build(BuildContext context) => MaterialApp.router(
        title: 'Dharini',
        theme: AppTheme.lightTheme,
        darkTheme: AppTheme.lightTheme,
        routerConfig: router,
        builder: (context, child) {
          if (!kIsWeb) return child!;

          final width = MediaQuery.of(context).size.width;

          return Container(
            color: const Color(0xFFF5F5F5),
            child: Center(
              child: SizedBox(
                width: width > 768 ? 768 : width,
                child: Material(
                  elevation: 8,
                  child: SafeArea(
                    child: child!,
                  ),
                ),
              ),
            ),
          );
        },
      );
}
