import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:design_system/design_system.dart';

class PastVisitCard extends StatelessWidget {
  const PastVisitCard({
    required this.farmName,
    required this.farmType,
    required this.siteCode,
    required this.visitScheduledDate,
    required this.visitedDate,
    this.visitStartedDate,
    required this.sampleCount,
    required this.sampleTypes,
    super.key,
  });
  final String farmName;
  final String farmType;
  final String siteCode;
  final DateTime visitScheduledDate;
  final DateTime? visitedDate;
  final DateTime? visitStartedDate;
  final num sampleCount;
  final List<String> sampleTypes;

  String get _formattedVisitedMonth =>
      visitedDate == null ? '' : DateFormat('MMM').format(visitedDate!);
  String get _formattedVisitedDay =>
      visitedDate == null ? '' : DateFormat('d').format(visitedDate!);
  String get _formattedVisitedTime =>
      visitedDate == null ? '' : DateFormat('h:mm a').format(visitedDate!);

  String get _formattedStartedTime => visitStartedDate == null
      ? ''
      : DateFormat('h:mm a').format(visitStartedDate!);

  String get _formattedSampleTypes {
    if (sampleTypes.isEmpty) return '';
    if (sampleTypes.length <= 2) return sampleTypes.join(', ');
    final remainingCount = sampleTypes.length - 2;
    final suffix = remainingCount == 1 ? 'sample' : 'samples';
    return '${sampleTypes.take(2).join(', ')} +$remainingCount $suffix';
  }

  @override
  Widget build(BuildContext context) => Card(
        color: AppColors.backgroundLight,
        elevation: 1,
        margin: EdgeInsets.zero,
        shape: RoundedRectangleBorder(
          borderRadius: BorderRadius.circular(8),
        ),
        child: Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: <Widget>[
              Row(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: <Widget>[
                        Text(
                          farmName,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 18,
                            color: AppColors.actionButtonDark,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          '$farmType | SITE CODE: $siteCode'.toUpperCase(),
                          style: TextStyle(
                            color: Colors.grey[600],
                            fontSize: 12,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                      ],
                    ),
                  ),
                  Container(
                    width: 64,
                    padding: const EdgeInsets.all(8),
                    decoration: BoxDecoration(
                      color: const Color(0xFFEAE8D9),
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Column(
                      children: <Widget>[
                        Text(
                          // _formattedMonth.toUpperCase(),
                          _formattedVisitedMonth.toUpperCase(),
                          style: const TextStyle(
                            fontSize: 14,
                            fontWeight: FontWeight.w500,
                          ),
                        ),
                        Text(
                          // _formattedDay,
                          _formattedVisitedDay,
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
              Container(
                height: 1,
                width: 360,
                margin: const EdgeInsets.symmetric(vertical: 16),
                color: Colors.grey[300],
              ),
              Row(
                children: <Widget>[
                  Icon(
                    Icons.science_outlined,
                    color: Colors.blue[700],
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Expanded(
                    child: Text(
                      '$sampleCount | $_formattedSampleTypes',
                      maxLines: 1,
                      overflow: TextOverflow.ellipsis,
                      style: const TextStyle(
                        fontSize: 14,
                        fontWeight: FontWeight.w500,
                      ),
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              Row(
                children: <Widget>[
                  Icon(
                    Icons.access_time,
                    color: Colors.blue[700],
                    size: 16,
                  ),
                  const SizedBox(width: 4),
                  Text(
                    _formattedStartedTime.isNotEmpty
                        ? 'Visited: $_formattedStartedTime - $_formattedVisitedTime'
                        : _formattedVisitedTime,
                    style: const TextStyle(
                      fontSize: 14,
                      fontWeight: FontWeight.w500,
                    ),
                  ),
                ],
              ),
            ],
          ),
        ),
      );
}
