// import 'package:flutter/material.dart';

// import '../../design_system.dart';

// class PendingVisitTile extends StatelessWidget {
//   const PendingVisitTile({
//     required this.name,
//     required this.location,
//     required this.date,
//     required this.time,
//     required this.completedVisits,
//     required this.totalVisits,
//     super.key,
//     this.isOverdue = false,
//   });
//   final String name;
//   final String location;
//   final String date;
//   final String time;
//   final int completedVisits;
//   final int totalVisits;
//   final bool isOverdue;

//   @override
//   Widget build(BuildContext context) => ExpansionTile(
//         leading: CircleAvatar(
//           backgroundColor:AppColors.nameavtarbackground ,
//           child: Text(
//             name.split(' ').map((String e) => e[0]).take(2).join(),
//            style: Theme.of(context)
//                   .textTheme
//                   .labelLarge
//                   ?.copyWith(color: AppColors.labletestblack),
//           ),
//         ),
//         title: Column(
//           crossAxisAlignment: CrossAxisAlignment.start,
//           children: <Widget>[
//             Text(
//               name,
//               style: Theme.of(context)
//                   .textTheme
//                   .displaySmall
//                   ?.copyWith(color: AppColors.labletestblack),
//             ),
//             Text(
//               '$completedVisits/$totalVisits Visits Pending',
//               style: Theme.of(context)
//                   .textTheme
//                   .bodySmall
//                   ?.copyWith(color: AppColors.labletestblack),
//             ),
//           ],
//         ),
//         children: <Widget>[
//           Padding(
//             padding: Spacing.p(2),
//             child: Column(
//               children: <Widget>[
//                 _buildVisitCard(
//                     date: date,
//                     time: time,
//                     location: location,
//                     isOverdue: isOverdue,
//                     context: context,),
//                 const SizedBox(height: 8),

//               ],
//             ),
//           ),
//         ],
//       );

//   Widget _buildVisitCard(
//           {required String date,
//           required String time,
//           required String location,
//           required bool isOverdue,
//           required BuildContext context,}) =>
//       Container(
//         decoration: BoxDecoration(
//           border: Border.all(color: Colors.grey[300]!),
//           borderRadius: BorderRadius.circular(8),
//         ),
//         child: Padding(
//           padding: Spacing.p(2),
//           child: Row(
//             children: <Widget>[
//               Expanded(
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: <Widget>[
//                     Text(
//                       date,
//                       style: Theme.of(context)
//                           .textTheme
//                           .labelSmall
//                           ?.copyWith(color: AppColors.labletestblack),
//                     ),
//                     Text(
//                       time,
//                       style: Theme.of(context)
//                           .textTheme
//                           .bodySmall
//                           ?.copyWith(color: AppColors.labletestblack),
//                     ),
//                     Text(
//                       'PM',
//                       style: Theme.of(context)
//                           .textTheme
//                           .bodySmall
//                           ?.copyWith(color: AppColors.labletestblack),
//                     ),
//                   ],
//                 ),
//               ),
//               Container(
//                 color: AppColors.borderLight,
//                 width: 2,
//                 height: 80,
//               ),
//               SizedBox(
//                 width: Spacing.space(2),
//               ),
//               Expanded(
//                 flex: 3,
//                 child: Column(
//                   crossAxisAlignment: CrossAxisAlignment.start,
//                   children: <Widget>[
//                     if (isOverdue)
//                       Container(
//                         padding: const EdgeInsets.symmetric(
//                           horizontal: 8,
//                           vertical: 4,
//                         ),
//                         decoration: BoxDecoration(
//                           color: Colors.red[50],
//                           borderRadius: BorderRadius.circular(4),
//                         ),
//                         child: Text(
//                           'OVERDUE',
//                           style: TextStyle(
//                             color: Colors.red[700],
//                             fontSize: 12,
//                             fontWeight: FontWeight.bold,
//                           ),
//                         ),
//                       ),
//                     SizedBox(
//                       height: Spacing.space(2),
//                     ),
//                     Text(
//                       'Prakash Broilers',
//                       style: Theme.of(context)
//                           .textTheme
//                           .bodyMedium
//                           ?.copyWith(color: AppColors.labletestblack),
//                     ),
//                     Row(
//                       children: <Widget>[
//                         Icon(
//                           Icons.location_on_outlined,
//                           size: 16,
//                           color: Colors.blue[700],
//                         ),
//                         SizedBox(
//                           width: Spacing.space(2),
//                         ),
//                         Text(
//                           location,
//                           style: Theme.of(context)
//                               .textTheme
//                               .labelLarge
//                               ?.copyWith(color: AppColors.labletestgrey),
//                         ),
//                         const SizedBox(width: 8),
//                         Text(
//                           '|',
//                           style: Theme.of(context)
//                               .textTheme
//                               .labelLarge
//                               ?.copyWith(color: AppColors.labletestgrey),
//                         ),
//                         const SizedBox(width: 8),
//                         Text(
//                           'New Text',
//                           style: Theme.of(context)
//                               .textTheme
//                               .labelLarge
//                               ?.copyWith(color: AppColors.labletestgrey),
//                         ),
//                       ],
//                     ),
//                   ],
//                 ),
//               ),
//             ],
//           ),
//         ),
//       );
// }

import 'package:flutter/material.dart';

import '../../design_system.dart';

class PendingVisitTile extends StatelessWidget {
  const PendingVisitTile({
    required this.name,
    required this.location,
    required this.date,
    required this.time,
    required this.completedVisits,
    required this.totalVisits,
    this.isOverdue = false,
    super.key,
  });

  final String name;
  final String location;
  final String date;
  final String time;
  final int completedVisits;
  final int totalVisits;
  final bool isOverdue;

  @override
  Widget build(BuildContext context) => ExpansionTile(
        leading: CircleAvatar(
          backgroundColor: AppColors.nameavtarbackground,
          child: Text(
            name.split(' ').map((String e) => e[0]).take(2).join(),
            style: Theme.of(context)
                .textTheme
                .labelLarge
                ?.copyWith(color: AppColors.labletestblack),
          ),
        ),
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: <Widget>[
                Text(
                  name.length > 12 ? '${name.substring(0, 12)}...' : name,
                  style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: AppColors.labletestblack,
                      overflow: TextOverflow.ellipsis,),
                ),
                if (isOverdue)
                  Container(
                    padding: const EdgeInsets.symmetric(
                      horizontal: 8,
                      vertical: 4,
                    ),
                    decoration: BoxDecoration(
                      color: Colors.red[50],
                      borderRadius: BorderRadius.circular(4),
                    ),
                    child: Text(
                      'OVERDUE',
                      style: TextStyle(
                        color: Colors.red[700],
                        fontSize: 12,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
            Text(
              '$completedVisits/$totalVisits Visits Pending',
              style: Theme.of(context)
                  .textTheme
                  .bodySmall
                  ?.copyWith(color: AppColors.labletestblack),
            ),
          ],
        ),
        children: <Widget>[
          Padding(
            padding: Spacing.p(2),
            child: _buildVisitCard(
              date: date,
              time: time,
              location: location,
              isOverdue: isOverdue,
              context: context,
            ),
          ),
        ],
      );

  Widget _buildVisitCard({
    required String date,
    required String time,
    required String location,
    required bool isOverdue,
    required BuildContext context,
  }) =>
      Container(
        decoration: BoxDecoration(
          border: Border.all(color: Colors.grey[300]!),
          borderRadius: BorderRadius.circular(8),
        ),
        child: Padding(
          padding: Spacing.p(2),
          child: Row(
            children: <Widget>[
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    Text(
                      date,
                      style: Theme.of(context)
                          .textTheme
                          .labelSmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    Text(
                      time,
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    Text(
                      'PM',
                      style: Theme.of(context)
                          .textTheme
                          .bodySmall
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                  ],
                ),
              ),
              Container(
                color: AppColors.borderLight,
                width: 2,
                height: 80,
              ),
              SizedBox(
                width: Spacing.space(2),
              ),
              Expanded(
                flex: 3,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    if (isOverdue)
                      Container(
                        padding: const EdgeInsets.symmetric(
                          horizontal: 8,
                          vertical: 4,
                        ),
                        decoration: BoxDecoration(
                          color: Colors.red[50],
                          borderRadius: BorderRadius.circular(4),
                        ),
                        child: Text(
                          'OVERDUE',
                          style: TextStyle(
                            color: Colors.red[700],
                            fontSize: 12,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                      ),
                    SizedBox(
                      height: Spacing.space(2),
                    ),
                    Text(
                      location,
                      style: Theme.of(context)
                          .textTheme
                          .bodyMedium
                          ?.copyWith(color: AppColors.labletestblack),
                    ),
                    Row(
                      children: <Widget>[
                        Icon(
                          Icons.location_on_outlined,
                          size: 16,
                          color: Colors.blue[700],
                        ),
                        SizedBox(
                          width: Spacing.space(2),
                        ),
                        Expanded(
                          child: Text(
                            location,
                            style: Theme.of(context)
                                .textTheme
                                .labelLarge
                                ?.copyWith(color: AppColors.labletestgrey),
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      );
}
