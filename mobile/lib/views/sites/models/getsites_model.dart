// class Getsitesmodel {
//   bool? success;
//   String? message;
//   List<Data>? data;

//   Getsitesmodel({this.success, this.message, this.data});

//   Getsitesmodel.fromJson(Map<String, dynamic> json) {
//     success = json['success'];
//     message = json['message'];
//     if (json['data'] != null) {
//       data = <Data>[];
//       json['data'].forEach((v) {
//         data!.add(new Data.fromJson(v));
//       });
//     }
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['success'] = this.success;
//     data['message'] = this.message;
//     if (this.data != null) {
//       data['data'] = this.data!.map((v) => v.toJson()).toList();
//     }
//     return data;
//   }
// }

// class Data {
//   String? id;
//   String? name;
//   String? siteCode;
//   var collectionConsent;
//   int? collectionFrequencyInterval;
//   int? collectionFrequency;
//   List<dynamic>? collectionDayOfWeek;
//   String? collectionTime;
//   String? collectionStartDate;
//   String? collectionLastScheduleDate;
//   int? collectionDuration;
//   String? collectionExpiryDate;
//  var  photos;
//   String? farmType;
//   String? siteType;
//   String? siteOwnerName;
//   String? siteOwnerNumber;
//   int? workerNumber;
//   String? address;
//   int? pinCode;
//   String? comment;
//   int? status;
//   String? testResult;
//   String? createdAt;
//   String? updatedAt;
//   Project? project;
//   List<Diseases>? diseases;
//   List<Visits>? visits;
//   var collectionCollector;
//   CreatedBy? createdBy;
//   CreatedBy? updatedBy;

//   Data(
//       {this.id,
//       this.name,
//       this.siteCode,
//       this.collectionConsent,
//       this.collectionFrequencyInterval,
//       this.collectionFrequency,
//       this.collectionDayOfWeek,
//       this.collectionTime,
//       this.collectionStartDate,
//       this.collectionLastScheduleDate,
//       this.collectionDuration,
//       this.collectionExpiryDate,
//       this.photos,
//       this.farmType,
//       this.siteType,
//       this.siteOwnerName,
//       this.siteOwnerNumber,
//       this.workerNumber,
//       this.address,
//       this.pinCode,
//       this.comment,
//       this.status,
//       this.testResult,
//       this.createdAt,
//       this.updatedAt,
//       this.project,
//       this.diseases,
//       this.visits,
//       this.collectionCollector,
//       this.createdBy,
//       this.updatedBy});

//   Data.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     name = json['name'];
//     siteCode = json['siteCode'];
//     collectionConsent = json['collectionConsent'];
//     collectionFrequencyInterval = json['collectionFrequencyInterval'];
//     collectionFrequency = json['collectionFrequency'];
//     collectionDayOfWeek = json['collectionDayOfWeek'];
//     collectionTime = json['collectionTime'];
//     collectionStartDate = json['collectionStartDate'];
//     collectionLastScheduleDate = json['collectionLastScheduleDate'];
//     collectionDuration = json['collectionDuration'];
//     collectionExpiryDate = json['collectionExpiryDate'];
//     // if (json['photos'] != null) {
//     //   photos = <Null>[];
//     //   json['photos'].forEach((v) {
//     //     photos!.add(new Null.fromJson(v));
//     //   });
//     // }
//     farmType = json['farmType'];
//     siteType = json['siteType'];
//     siteOwnerName = json['siteOwnerName'];
//     siteOwnerNumber = json['siteOwnerNumber'];
//     workerNumber = json['workerNumber'];
//     address = json['address'];
//     pinCode = json['pinCode'];
//     comment = json['comment'];
//     status = json['status'];
//     testResult = json['testResult'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//     project =
//         json['project'] != null ? new Project.fromJson(json['project']) : null;
//     if (json['diseases'] != null) {
//       diseases = <Diseases>[];
//       json['diseases'].forEach((v) {
//         diseases!.add(new Diseases.fromJson(v));
//       });
//     }
//     if (json['visits'] != null) {
//       visits = <Visits>[];
//       json['visits'].forEach((v) {
//         visits!.add(new Visits.fromJson(v));
//       });
//     }
//     collectionCollector = json['collectionCollector'];
//     createdBy = json['createdBy'] != null
//         ? new CreatedBy.fromJson(json['createdBy'])
//         : null;
//     updatedBy = json['updatedBy'] != null
//         ? new CreatedBy.fromJson(json['updatedBy'])
//         : null;
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['name'] = this.name;
//     data['siteCode'] = this.siteCode;
//     data['collectionConsent'] = this.collectionConsent;
//     data['collectionFrequencyInterval'] = this.collectionFrequencyInterval;
//     data['collectionFrequency'] = this.collectionFrequency;
//     data['collectionDayOfWeek'] = this.collectionDayOfWeek;
//     data['collectionTime'] = this.collectionTime;
//     data['collectionStartDate'] = this.collectionStartDate;
//     data['collectionLastScheduleDate'] = this.collectionLastScheduleDate;
//     data['collectionDuration'] = this.collectionDuration;
//     data['collectionExpiryDate'] = this.collectionExpiryDate;
//     // if (this.photos != null) {
//     //   data['photos'] = this.photos!.map((v) => v.toJson()).toList();
//     // }
//     data['farmType'] = this.farmType;
//     data['siteType'] = this.siteType;
//     data['siteOwnerName'] = this.siteOwnerName;
//     data['siteOwnerNumber'] = this.siteOwnerNumber;
//     data['workerNumber'] = this.workerNumber;
//     data['address'] = this.address;
//     data['pinCode'] = this.pinCode;
//     data['comment'] = this.comment;
//     data['status'] = this.status;
//     data['testResult'] = this.testResult;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     if (this.project != null) {
//       data['project'] = this.project!.toJson();
//     }
//     if (this.diseases != null) {
//       data['diseases'] = this.diseases!.map((v) => v.toJson()).toList();
//     }
//     if (this.visits != null) {
//       data['visits'] = this.visits!.map((v) => v.toJson()).toList();
//     }
//     data['collectionCollector'] = this.collectionCollector;
//     if (this.createdBy != null) {
//       data['createdBy'] = this.createdBy!.toJson();
//     }
//     if (this.updatedBy != null) {
//       data['updatedBy'] = this.updatedBy!.toJson();
//     }
//     return data;
//   }
// }

// class Project {
//   String? id;
//   String? name;
//   String? code;
//   var email;
//   var logisticDetails;
//   var processDetail;
//   bool? isOnboardingCompleted;
//   int? status;
//   String? createdAt;
//   String? updatedAt;

//   Project(
//       {this.id,
//       this.name,
//       this.code,
//       this.email,
//       this.logisticDetails,
//       this.processDetail,
//       this.isOnboardingCompleted,
//       this.status,
//       this.createdAt,
//       this.updatedAt});

//   Project.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     name = json['name'];
//     code = json['code'];
//     email = json['email'];
//     logisticDetails = json['logisticDetails'];
//     processDetail = json['processDetail'];
//     isOnboardingCompleted = json['isOnboardingCompleted'];
//     status = json['status'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['name'] = this.name;
//     data['code'] = this.code;
//     data['email'] = this.email;
//     data['logisticDetails'] = this.logisticDetails;
//     data['processDetail'] = this.processDetail;
//     data['isOnboardingCompleted'] = this.isOnboardingCompleted;
//     data['status'] = this.status;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     return data;
//   }
// }

// class Diseases {
//   String? id;
//   String? code;
//   String? name;
//   String? shortName;
//   int? status;
//   String? createdAt;
//   String? updatedAt;

//   Diseases(
//       {this.id,
//       this.code,
//       this.name,
//       this.shortName,
//       this.status,
//       this.createdAt,
//       this.updatedAt});

//   Diseases.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     code = json['code'];
//     name = json['name'];
//     shortName = json['shortName'];
//     status = json['status'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['code'] = this.code;
//     data['name'] = this.name;
//     data['shortName'] = this.shortName;
//     data['status'] = this.status;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     return data;
//   }
// }

// class Visits {
//   String? id;
//   String? questionSetId;
//   var visitDateTime;
//   String? visitScheduleDateTime;
//   String? visitStatus;
//   var photos;
//   var comment;
//   int? status;
//  var suspectedPositives;
//   bool? isCompleted;
//   String? createdAt;
//   String? updatedAt;

//   Visits(
//       {this.id,
//       this.questionSetId,
//       this.visitDateTime,
//       this.visitScheduleDateTime,
//       this.visitStatus,
//       this.photos,
//       this.comment,
//       this.status,
//       this.suspectedPositives,
//       this.isCompleted,
//       this.createdAt,
//       this.updatedAt});

//   Visits.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     questionSetId = json['questionSetId'];
//     visitDateTime = json['visitDateTime'];
//     visitScheduleDateTime = json['visitScheduleDateTime'];
//     visitStatus = json['visitStatus'];
//     photos = json['photos'];
//     comment = json['comment'];
//     status = json['status'];
//     // if (json['suspectedPositives'] != null) {
//     //   suspectedPositives = <Null>[];
//     //   json['suspectedPositives'].forEach((v) {
//     //     suspectedPositives!.add(new Null.fromJson(v));
//     //   });
//     // }
//     isCompleted = json['isCompleted'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['questionSetId'] = this.questionSetId;
//     data['visitDateTime'] = this.visitDateTime;
//     data['visitScheduleDateTime'] = this.visitScheduleDateTime;
//     data['visitStatus'] = this.visitStatus;
//     data['photos'] = this.photos;
//     data['comment'] = this.comment;
//     data['status'] = this.status;
//     // if (this.suspectedPositives != null) {
//     //   data['suspectedPositives'] =
//     //       this.suspectedPositives!.map((v) => v.toJson()).toList();
//     // }
//     data['isCompleted'] = this.isCompleted;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     return data;
//   }
// }

// class CreatedBy {
//   String? id;
//   String? firstName;
//   String? lastName;
//   var designation;
//   String? contactNumber;
//   var address;
//   String? email;
//   var otp;
//   int? status;
//   String? createdAt;
//   String? updatedAt;

//   CreatedBy(
//       {this.id,
//       this.firstName,
//       this.lastName,
//       this.designation,
//       this.contactNumber,
//       this.address,
//       this.email,
//       this.otp,
//       this.status,
//       this.createdAt,
//       this.updatedAt});

//   CreatedBy.fromJson(Map<String, dynamic> json) {
//     id = json['id'];
//     firstName = json['firstName'];
//     lastName = json['lastName'];
//     designation = json['designation'];
//     contactNumber = json['contactNumber'];
//     address = json['address'];
//     email = json['email'];
//     otp = json['otp'];
//     status = json['status'];
//     createdAt = json['createdAt'];
//     updatedAt = json['updatedAt'];
//   }

//   Map<String, dynamic> toJson() {
//     final Map<String, dynamic> data = new Map<String, dynamic>();
//     data['id'] = this.id;
//     data['firstName'] = this.firstName;
//     data['lastName'] = this.lastName;
//     data['designation'] = this.designation;
//     data['contactNumber'] = this.contactNumber;
//     data['address'] = this.address;
//     data['email'] = this.email;
//     data['otp'] = this.otp;
//     data['status'] = this.status;
//     data['createdAt'] = this.createdAt;
//     data['updatedAt'] = this.updatedAt;
//     return data;
//   }
// }

class Getsitesmodel {
  bool? success;
  String? message;
  List<Data>? data;

  Getsitesmodel({this.success, this.message, this.data});

  Getsitesmodel.fromJson(Map<String, dynamic> json) {
    success = json['success'];
    message = json['message'];
    if (json['data'] != null) {
      data = <Data>[];
      json['data'].forEach((v) {
        data!.add(new Data.fromJson(v));
      });
    }
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['success'] = this.success;
    data['message'] = this.message;
    if (this.data != null) {
      data['data'] = this.data!.map((v) => v.toJson()).toList();
    }
    return data;
  }
}

class Data {
  String? id;
  String? name;
  String? siteCode;
  var collectionConsent;
  int? collectionFrequencyInterval;
  int? collectionFrequency;
  List<dynamic>? collectionDayOfWeek;
  String? collectionTime;
  String? collectionStartDate;
  String? collectionLastScheduleDate;
  int? collectionDuration;
  String? collectionExpiryDate;
  var photos;
  String? farmType;
  String? siteType;
  String? siteOwnerName;
  String? siteOwnerNumber;
  int? workerNumber;
  String? address;
  int? pinCode;
  String? comment;
  int? status;
  String? testResult;
  String? createdAt;
  String? updatedAt;
  Project? project;
  List<Diseases>? diseases;
  List<Visits>? visits;
  CollectionCollector? collectionCollector;
  CreatedBy? createdBy;
  CreatedBy? updatedBy;

  Data(
      {this.id,
      this.name,
      this.siteCode,
      this.collectionConsent,
      this.collectionFrequencyInterval,
      this.collectionFrequency,
      this.collectionDayOfWeek,
      this.collectionTime,
      this.collectionStartDate,
      this.collectionLastScheduleDate,
      this.collectionDuration,
      this.collectionExpiryDate,
      this.photos,
      this.farmType,
      this.siteType,
      this.siteOwnerName,
      this.siteOwnerNumber,
      this.workerNumber,
      this.address,
      this.pinCode,
      this.comment,
      this.status,
      this.testResult,
      this.createdAt,
      this.updatedAt,
      this.project,
      this.diseases,
      this.visits,
      this.collectionCollector,
      this.createdBy,
      this.updatedBy});

  Data.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    siteCode = json['siteCode'];
    collectionConsent = json['collectionConsent'];
    collectionFrequencyInterval = json['collectionFrequencyInterval'];
    collectionFrequency = json['collectionFrequency'];
    collectionDayOfWeek = json['collectionDayOfWeek'];
    collectionTime = json['collectionTime'];
    collectionStartDate = json['collectionStartDate'];
    collectionLastScheduleDate = json['collectionLastScheduleDate'];
    collectionDuration = json['collectionDuration'];
    collectionExpiryDate = json['collectionExpiryDate'];
    // if (json['photos'] != null) {
    //   photos = <Null>[];
    //   json['photos'].forEach((v) {
    //     photos!.add(new Null.fromJson(v));
    //   });
    // }
    farmType = json['farmType'];
    siteType = json['siteType'];
    siteOwnerName = json['siteOwnerName'];
    siteOwnerNumber = json['siteOwnerNumber'];
    workerNumber = json['workerNumber'];
    address = json['address'];
    pinCode = json['pinCode'];
    comment = json['comment'];
    status = json['status'];
    testResult = json['testResult'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
    project =
        json['project'] != null ? new Project.fromJson(json['project']) : null;
    if (json['diseases'] != null) {
      diseases = <Diseases>[];
      json['diseases'].forEach((v) {
        diseases!.add(new Diseases.fromJson(v));
      });
    }
    if (json['visits'] != null) {
      visits = <Visits>[];
      json['visits'].forEach((v) {
        visits!.add(new Visits.fromJson(v));
      });
    }
    collectionCollector = json['collectionCollector'] != null
        ? new CollectionCollector.fromJson(json['collectionCollector'])
        : null;
    createdBy = json['createdBy'] != null
        ? new CreatedBy.fromJson(json['createdBy'])
        : null;
    updatedBy = json['updatedBy'] != null
        ? new CreatedBy.fromJson(json['updatedBy'])
        : null;
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['siteCode'] = this.siteCode;
    data['collectionConsent'] = this.collectionConsent;
    data['collectionFrequencyInterval'] = this.collectionFrequencyInterval;
    data['collectionFrequency'] = this.collectionFrequency;
    data['collectionDayOfWeek'] = this.collectionDayOfWeek;
    data['collectionTime'] = this.collectionTime;
    data['collectionStartDate'] = this.collectionStartDate;
    data['collectionLastScheduleDate'] = this.collectionLastScheduleDate;
    data['collectionDuration'] = this.collectionDuration;
    data['collectionExpiryDate'] = this.collectionExpiryDate;
    // if (this.photos != null) {
    //   data['photos'] = this.photos!.map((v) => v.toJson()).toList();
    // }
    data['farmType'] = this.farmType;
    data['siteType'] = this.siteType;
    data['siteOwnerName'] = this.siteOwnerName;
    data['siteOwnerNumber'] = this.siteOwnerNumber;
    data['workerNumber'] = this.workerNumber;
    data['address'] = this.address;
    data['pinCode'] = this.pinCode;
    data['comment'] = this.comment;
    data['status'] = this.status;
    data['testResult'] = this.testResult;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    if (this.project != null) {
      data['project'] = this.project!.toJson();
    }
    if (this.diseases != null) {
      data['diseases'] = this.diseases!.map((v) => v.toJson()).toList();
    }
    if (this.visits != null) {
      data['visits'] = this.visits!.map((v) => v.toJson()).toList();
    }
    if (this.collectionCollector != null) {
      data['collectionCollector'] = this.collectionCollector!.toJson();
    }
    if (this.createdBy != null) {
      data['createdBy'] = this.createdBy!.toJson();
    }
    if (this.updatedBy != null) {
      data['updatedBy'] = this.updatedBy!.toJson();
    }
    return data;
  }
}

class Project {
  String? id;
  String? name;
  String? code;
  var email;
  var logisticDetails;
  var processDetail;
  bool? isOnboardingCompleted;
  int? status;
  String? createdAt;
  String? updatedAt;

  Project(
      {this.id,
      this.name,
      this.code,
      this.email,
      this.logisticDetails,
      this.processDetail,
      this.isOnboardingCompleted,
      this.status,
      this.createdAt,
      this.updatedAt});

  Project.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    name = json['name'];
    code = json['code'];
    email = json['email'];
    logisticDetails = json['logisticDetails'];
    processDetail = json['processDetail'];
    isOnboardingCompleted = json['isOnboardingCompleted'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['name'] = this.name;
    data['code'] = this.code;
    data['email'] = this.email;
    data['logisticDetails'] = this.logisticDetails;
    data['processDetail'] = this.processDetail;
    data['isOnboardingCompleted'] = this.isOnboardingCompleted;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class Diseases {
  String? id;
  String? code;
  String? name;
  String? shortName;
  int? status;
  String? createdAt;
  String? updatedAt;

  Diseases(
      {this.id,
      this.code,
      this.name,
      this.shortName,
      this.status,
      this.createdAt,
      this.updatedAt});

  Diseases.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    code = json['code'];
    name = json['name'];
    shortName = json['shortName'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['code'] = this.code;
    data['name'] = this.name;
    data['shortName'] = this.shortName;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class Visits {
  String? id;
  String? questionSetId;
  var visitDateTime;
  String? visitScheduleDateTime;
  String? visitStatus;
  var photos;
  var comment;
  int? status;
  var suspectedPositives;
  bool? isCompleted;
  String? createdAt;
  String? updatedAt;

  Visits(
      {this.id,
      this.questionSetId,
      this.visitDateTime,
      this.visitScheduleDateTime,
      this.visitStatus,
      this.photos,
      this.comment,
      this.status,
      this.suspectedPositives,
      this.isCompleted,
      this.createdAt,
      this.updatedAt});

  Visits.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    questionSetId = json['questionSetId'];
    visitDateTime = json['visitDateTime'];
    visitScheduleDateTime = json['visitScheduleDateTime'];
    visitStatus = json['visitStatus'];
    photos = json['photos'];
    comment = json['comment'];
    status = json['status'];
    // if (json['suspectedPositives'] != null) {
    //   suspectedPositives = <Null>[];
    //   json['suspectedPositives'].forEach((v) {
    //     suspectedPositives!.add(new Null.fromJson(v));
    //   });
    // }
    isCompleted = json['isCompleted'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['questionSetId'] = this.questionSetId;
    data['visitDateTime'] = this.visitDateTime;
    data['visitScheduleDateTime'] = this.visitScheduleDateTime;
    data['visitStatus'] = this.visitStatus;
    data['photos'] = this.photos;
    data['comment'] = this.comment;
    data['status'] = this.status;
    // if (this.suspectedPositives != null) {
    //   data['suspectedPositives'] =
    //       this.suspectedPositives!.map((v) => v.toJson()).toList();
    // }
    data['isCompleted'] = this.isCompleted;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class CollectionCollector {
  String? id;
  String? firstName;
  String? lastName;
  var designation;
  var contactNumber;
  var address;
  String? email;
  var otp;
  int? status;
  String? createdAt;
  String? updatedAt;

  CollectionCollector(
      {this.id,
      this.firstName,
      this.lastName,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.otp,
      this.status,
      this.createdAt,
      this.updatedAt});

  CollectionCollector.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    designation = json['designation'];
    contactNumber = json['contactNumber'];
    address = json['address'];
    email = json['email'];
    otp = json['otp'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['designation'] = this.designation;
    data['contactNumber'] = this.contactNumber;
    data['address'] = this.address;
    data['email'] = this.email;
    data['otp'] = this.otp;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}

class CreatedBy {
  String? id;
  String? firstName;
  String? lastName;
  var designation;
  String? contactNumber;
  var address;
  String? email;
  var otp;
  int? status;
  String? createdAt;
  String? updatedAt;

  CreatedBy(
      {this.id,
      this.firstName,
      this.lastName,
      this.designation,
      this.contactNumber,
      this.address,
      this.email,
      this.otp,
      this.status,
      this.createdAt,
      this.updatedAt});

  CreatedBy.fromJson(Map<String, dynamic> json) {
    id = json['id'];
    firstName = json['firstName'];
    lastName = json['lastName'];
    designation = json['designation'];
    contactNumber = json['contactNumber'];
    address = json['address'];
    email = json['email'];
    otp = json['otp'];
    status = json['status'];
    createdAt = json['createdAt'];
    updatedAt = json['updatedAt'];
  }

  Map<String, dynamic> toJson() {
    final Map<String, dynamic> data = new Map<String, dynamic>();
    data['id'] = this.id;
    data['firstName'] = this.firstName;
    data['lastName'] = this.lastName;
    data['designation'] = this.designation;
    data['contactNumber'] = this.contactNumber;
    data['address'] = this.address;
    data['email'] = this.email;
    data['otp'] = this.otp;
    data['status'] = this.status;
    data['createdAt'] = this.createdAt;
    data['updatedAt'] = this.updatedAt;
    return data;
  }
}
