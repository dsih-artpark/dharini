import 'package:flutter/material.dart';

class AppCarousel extends StatefulWidget {
  const AppCarousel({
    required this.children,
    this.autoPlay = false,
    this.autoPlayInterval = const Duration(seconds: 5),
    this.height,
    super.key,
  });

  final List<Widget> children;
  final bool autoPlay;
  final Duration autoPlayInterval;
  final double? height;

  @override
  State<AppCarousel> createState() => _AppCarouselState();
}

class _AppCarouselState extends State<AppCarousel> {
  late final PageController _pageController;
  int _currentPage = 0;

  @override
  void initState() {
    super.initState();
    _pageController = PageController();
    if (widget.autoPlay) {
      _startAutoPlay();
    }
  }

  void _startAutoPlay() {
    Future<void>.delayed(widget.autoPlayInterval).then((_) {
      if (mounted) {
        final int nextPage = (_currentPage + 1) % widget.children.length;
        _pageController.animateToPage(
          nextPage,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeInOut,
        );
        _startAutoPlay();
      }
    });
  }

  @override
  void dispose() {
    _pageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) => Column(
        children: <Widget>[
          SizedBox(
            height: widget.height,
            child: PageView(
              controller: _pageController,
              onPageChanged: (int index) {
                setState(() {
                  _currentPage = index;
                });
              },
              children: widget.children,
            ),
          ),
          const SizedBox(height: 8),
          // Indicators below the card
          Row(
            mainAxisAlignment: MainAxisAlignment.center,
            children: List<Widget>.generate(
              widget.children.length,
              (int index) => Container(
                width: 8,
                height: 8,
                margin: const EdgeInsets.symmetric(horizontal: 4),
                decoration: BoxDecoration(
                  shape: BoxShape.circle,
                  color: _currentPage == index
                      ? Colors.blue[700] // Active indicator color
                      : Colors.grey[300], // Inactive indicator color
                ),
              ),
            ),
          ),
        ],
      );
}
