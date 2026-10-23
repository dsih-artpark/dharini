// ignore_for_file: unused_local_variable

import 'package:built_collection/built_collection.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/utils/collection_plan_edit.dart';
import 'package:es_platform_mobile/utils/extensions/go_router.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:es_platform_mobile/widgets/image_upload_grid.dart';
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_dragmarker/flutter_map_dragmarker.dart';
import 'package:fquery/fquery.dart';
import 'package:latlong2/latlong.dart';

/// Maximum distance (in km) that the site location can be edited from its original position
const double LocationEditRadiusKm = 2.0;

class EditSite extends HookWidget {
  const EditSite({super.key, required this.siteId});

  final String siteId;

  @override
  Widget build(BuildContext context) {
    final siteDetails = useSite(siteId);
    final queryClient = useQueryClient();
    final projectId = useCurrentProjectId();

    final updateSiteMutation = useUpdateSite(
      siteId: siteId,
      onSuccess: () {
        //
        // Invalidate the site query to force a refetch
        queryClient.invalidateQueries(QueryKeys.site(projectId, siteId));

        context.go('/site-details', extra: {'siteId': siteId});
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('Site updated successfully'),
            backgroundColor: Colors.green,
            duration: Duration(seconds: 2),
          ),
        );
      },
      onError: (error) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text('Error creating site: $error'),
            backgroundColor: Colors.red,
          ),
        );
      },
    );

    // State variables
    final selectedDistrictId = useState<String?>(null);
    final selectedStateId = useState<String?>(null);
    final selectedSiteType = useState<String?>(null);
    // 'true' / 'false' as strings (older APKs parse this field as String)
    final collectionConsent = useState<String?>(null);
    final selectedFarmType = useState<String?>(null);
    final selectedCollectors = useState<String?>(null);
    final selectedDays = useState<List<String>>([]);
    final uploadedPhotoUrls = useState<List<String>>([]);

    // State for original coordinates (used as center for edit radius constraint)
    final originalLat = useState<double?>(null);
    final originalLng = useState<double?>(null);

    // State for current marker position (can be dragged within radius)
    final currentMarkerLat = useState<double?>(null);
    final currentMarkerLng = useState<double?>(null);

    // State for initial collection plan values
    final initialCollectionFrequency = useState<String?>(null);
    final initialSelectedDays = useState<List<String>>([]);
    final initialCollectionTime = useState<String?>(null);
    final initialCollectionDuration = useState<String?>(null);

    // Add validation state variables
    final validationErrors = useState<Map<String, String>>({});

    final scrollController = useScrollController();
    final siteNameKey = useMemoized(() => GlobalKey());
    final addressKey = useMemoized(() => GlobalKey());
    final farmTypeKey = useMemoized(() => GlobalKey());
    final siteTypeKey = useMemoized(() => GlobalKey());
    final consentKey = useMemoized(() => GlobalKey());
    final workersKey = useMemoized(() => GlobalKey());
    final stateKey = useMemoized(() => GlobalKey());
    final districtKey = useMemoized(() => GlobalKey());
    final pincodeKey = useMemoized(() => GlobalKey());
    final collectorKey = useMemoized(() => GlobalKey());
    final contactNameKey = useMemoized(() => GlobalKey());
    final phoneKey = useMemoized(() => GlobalKey());
    final daysKey = useMemoized(() => GlobalKey());
    final timeKey = useMemoized(() => GlobalKey());
    final durationKey = useMemoized(() => GlobalKey());

    // Controllers
    final sitenameController = useTextEditingController();
    final noofworkersController = useTextEditingController();
    final addressController = useTextEditingController();
    final pincodeController = useTextEditingController();
    final contactnameController = useTextEditingController();
    final commentController = useTextEditingController();
    final numberController = useTextEditingController();
    final latController = useTextEditingController();
    final longController = useTextEditingController();
    final intervalController = useTextEditingController();
    final frequencyController = useTextEditingController();
    final dayOfWeekController = useTextEditingController();
    final timeController = useTextEditingController();
    final durationController = useTextEditingController();

    // Pre-populate form with siteDetails when available
    useEffect(() {
      if (siteDetails.data != null) {
        final site = siteDetails.data!;

        // Populate text controllers
        sitenameController.text = site.name;
        noofworkersController.text = site.workerNumber?.toString() ?? '';
        addressController.text = site.address ?? '';
        pincodeController.text = site.pinCode?.toString() ?? '';
        contactnameController.text = site.siteOwnerName ?? '';
        commentController.text = site.comment ?? '';
        numberController.text = site.siteOwnerNumber ?? '';
        final siteLng =
            site.location?.coordinates?.coordinates.first.toDouble();
        final siteLat = site.location?.coordinates?.coordinates.last.toDouble();
        latController.text = siteLat?.toString() ?? '';
        longController.text = siteLng?.toString() ?? '';

        // original coordinates for radius constraint
        originalLat.value = siteLat;
        originalLng.value = siteLng;

        // Initialize current marker position
        currentMarkerLat.value = siteLat;
        currentMarkerLng.value = siteLng;
        intervalController.text =
            site.collectionFrequencyInterval?.toString() ?? '';
        frequencyController.text = site.collectionFrequency?.toString() ?? '';
        dayOfWeekController.text = site.collectionDayOfWeek
                ?.map((day) => day.name.toLowerCase())
                .toList()
                .join(', ') ??
            '';
        timeController.text = site.collectionTime ?? '';
        durationController.text = durationMonthsText(site.collectionDuration);

        // Populate state variables
        selectedFarmType.value = site.farmType;
        selectedSiteType.value = site.siteType == SiteType.private
            ? 'private'
            : site.siteType == SiteType.government
                ? 'government'
                : 'corporate';
        // Sites created before this field existed have no answer; leave it
        // unselected so the user must choose rather than defaulting to Yes
        collectionConsent.value =
            const ['true', 'false'].contains(site.collectionConsent)
                ? site.collectionConsent
                : null;

        // First set the state ID
        selectedStateId.value = site.location?.region?.parentRegion?.id ?? '';

        // Set district ID after a small delay to ensure state data is loaded
        Future.microtask(() {
          selectedDistrictId.value = site.location?.region?.id ?? '';
        });

        // Store the collector ID but don't set it until we verify it exists in the options
        final collectorId = site.collectionCollector?.id;
        selectedCollectors.value = null; // Reset initially

        selectedDays.value = site.collectionDayOfWeek
                ?.map((day) => day.name.toLowerCase())
                .toList() ??
            [];

        // Filter out any empty or malformed URLs before setting them
        final validPhotos = site.photos
                ?.where((url) => url.isNotEmpty && url.startsWith('http'))
                .toList() ??
            [];
        uploadedPhotoUrls.value = validPhotos;

        // Store initial collection plan values, as the controllers start out
        initialCollectionFrequency.value = intervalController.text;
        initialSelectedDays.value = site.collectionDayOfWeek
                ?.map((day) => day.name.toLowerCase())
                .toList() ??
            [];
        initialCollectionTime.value = site.collectionTime;
        initialCollectionDuration.value = durationController.text;
      }
      return null;
    }, [siteDetails.data]);

    // Region and collector queries
    final stateRegions = useRegions('state');
    final districtRegions = useDistricts(parentId: selectedStateId.value);
    final collectorCollectors = useCollectors(projectId);

    // Add effect to handle collector selection after options are loaded
    useEffect(() {
      if (collectorCollectors.data != null && siteDetails.data != null) {
        final collectorId = siteDetails.data!.collectionCollector?.id;
        if (collectorId != null) {
          // Check if the collector ID exists in the available options
          final exists = (collectorCollectors.data as List<User>)
              .any((collector) => collector.id == collectorId);
          if (exists) {
            selectedCollectors.value = collectorId;
          }
        }
      }
      return null;
    }, [collectorCollectors.data, siteDetails.data]);

    // Initial load of photos
    useEffect(() {
      if (siteDetails.data != null) {
        final site = siteDetails.data!;
        // Populate photos — ImageUploadGrid will receive these as initialUrls.
        final validPhotos = site.photos
                ?.where((url) => url.isNotEmpty && url.startsWith('http'))
                .toList() ??
            [];
        if (uploadedPhotoUrls.value.isEmpty) {
          uploadedPhotoUrls.value = validPhotos;
        }
      }
      return null;
    }, [siteDetails.data]);

    void scrollToFirstError() {
      final firstErrorKey = {
        'sitename': siteNameKey,
        'address': addressKey,
        'farmType': farmTypeKey,
        'siteType': siteTypeKey,
        'consent': consentKey,
        'workers': workersKey,
        'state': stateKey,
        'district': districtKey,
        'pincode': pincodeKey,
        'collector': collectorKey,
        'contactname': contactNameKey,
        'phone': phoneKey,
        'days': daysKey,
        'time': timeKey,
        'duration': durationKey,
      }[validationErrors.value.keys.first];

      if (firstErrorKey != null && scrollController.hasClients) {
        final context = firstErrorKey.currentContext;
        if (context != null) {
          Scrollable.ensureVisible(
            context,
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeInOut,
            alignment: 0.1,
          );
        }
      }
    }

    // Image selection helpers removed since they are handled inside ImageUploadGrid

    final districtOptions = useMemoized<List<CustomDropdownOption<String>>>(() {
      if (districtRegions.data == null) return [];
      final data = districtRegions.data?.subRegions;
      if (data == null || data.isEmpty) return [];
      return data
          .map((district) => CustomDropdownOption<String>(
                id: district.id,
                label: district.name,
              ))
          .where((option) => option.id.isNotEmpty && option.label.isNotEmpty)
          .toList();
    }, [districtRegions.data]);

    final stateOptions = useMemoized<List<CustomDropdownOption<String>>>(() {
      if (stateRegions.data == null) return [];
      final data = stateRegions.data;
      if (data == null || data.isEmpty) return [];
      return data
          .map((state) => CustomDropdownOption<String>(
                id: state.id,
                label: state.name,
              ))
          .toList();
    }, [stateRegions.data]);

    final collectorOptions =
        useMemoized<List<CustomDropdownOption<String>>>(() {
      if (collectorCollectors.data == null) return [];
      final data = collectorCollectors.data as List<User>;
      return data
          .map((collector) => CustomDropdownOption<String>(
                id: collector.id,
                label: '${collector.firstName} ${collector.lastName}',
              ))
          .toList();
    }, [collectorCollectors.data]);

    // Set selectedStateId based on district's parent state (assuming you have a way to fetch this)
    useEffect(() {
      if (siteDetails.data != null && selectedDistrictId.value != null) {
        // Logic to determine the parent state of the district
        // This might require an additional API call or a mapping in your data
        // For now, we'll assume it's fetched or set manually
      }
      return null;
    }, [siteDetails.data, selectedDistrictId.value]);

    final selectedState = useMemoized<String?>(() {
      return stateOptions
          .firstWhere(
            (option) => option.id == selectedStateId.value,
            orElse: () => CustomDropdownOption<String>(id: '', label: ''),
          )
          .label;
    }, [selectedStateId.value, stateOptions]);

    final selectedDistrict = useMemoized<String?>(() {
      return districtOptions
          .firstWhere(
            (option) => option.id == selectedDistrictId.value,
            orElse: () => CustomDropdownOption<String>(id: '', label: ''),
          )
          .label;
    }, [selectedDistrictId.value, districtOptions]);

    final coordinates = useLocationCoordinates(selectedDistrict, selectedState);

    useEffect(() {
      if (coordinates.data != null) {
        final coords = coordinates.data as Map<String, dynamic>?;
        if (coords != null &&
            coords['latitude'] != null &&
            coords['longitude'] != null) {
          latController.text = coords['latitude'].toString();
          longController.text = coords['longitude'].toString();
        }
      }
      return null;
    }, [coordinates.data]);

    // ignore: unused_element
    void _onSubmit(
      int collectionFrequencyInterval,
      int collectionFrequency,
      List<String> collectionDayOfWeek,
      String collectionTime,
      int collectionDuration,
    ) {
      selectedDays.value = collectionDayOfWeek;
    }

    Widget _buildSection({
      required BuildContext context,
      required String title,
      required Widget content,
    }) =>
        Container(
          margin: EdgeInsets.symmetric(vertical: Spacing.space(2)),
          decoration: BoxDecoration(
            color: Colors.white,
            border: Border(
              top: BorderSide(color: Theme.of(context).colorScheme.outline),
              bottom: BorderSide(color: Theme.of(context).colorScheme.outline),
            ),
          ),
          child: Padding(
            padding: Spacing.p(4),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: <Widget>[
                Text(title, style: Theme.of(context).textTheme.headlineMedium),
                SizedBox(height: Spacing.space(2)),
                content,
              ],
            ),
          ),
        );

    // edit PhotosAndCommentsSection widget
    Widget _buildPhotosAndCommentsSection() {
      return Column(
        mainAxisAlignment: MainAxisAlignment.start,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: <Widget>[
          const SizedBox(height: 16),
          Text(
            'Add Photos',
            style: AppTypography.textTheme.bodyB2Medium.copyWith(
              color: AppColors.textStrong,
            ),
          ),
          const SizedBox(height: 8),
          ImageUploadGrid(
            initialUrls: uploadedPhotoUrls.value,
            onChanged: (urls) => uploadedPhotoUrls.value = urls,
          ),
          const SizedBox(height: 16),
          Text(
            'Comments',
            style: AppTypography.textTheme.bodyB2Medium.copyWith(
              color: AppColors.textStrong,
            ),
          ),
          const SizedBox(height: 8),
          AppTextField(
            maxLines: 4,
            size: InputSize.sm,
            placeholder: 'Add some more information here...',
            helperText: '0/200',
            textInputAction: TextInputAction.done,
            controller: commentController,
          ),
        ],
      );
    }

    bool validateAllFields() {
      final errors = <String, String>{};

      if (sitenameController.text.isEmpty) {
        errors['sitename'] = 'Site name is required';
      }

      if (selectedFarmType.value == null) {
        errors['farmType'] = 'Farm type is required';
      }

      if (selectedSiteType.value == null) {
        errors['siteType'] = 'Site type is required';
      }

      if (collectionConsent.value == null) {
        errors['consent'] = 'Collection consent is required';
      }

      // if (noofworkersController.text.isEmpty) {
      //   errors['workers'] = 'Number of workers is required';
      // }

      if (addressController.text.isEmpty) {
        errors['address'] = 'Address is required';
      }

      if (selectedStateId.value == null) {
        errors['state'] = 'State is required';
      }

      if (selectedDistrictId.value == null) {
        errors['district'] = 'District is required';
      }

      if (pincodeController.text.isEmpty) {
        errors['pincode'] = 'Pincode is required';
      }

      if (selectedCollectors.value == null) {
        errors['collector'] = 'Need to assign any 1 collector';
      }

      // if (contactnameController.text.isEmpty) {
      //   errors['contactname'] = 'Contact name is required';
      // }

      // if (numberController.text.isEmpty) {
      //   errors['phone'] = 'Phone number is required';
      // }

      if (selectedDays.value.isEmpty) {
        errors['days'] = 'Collection days are required';
      }

      if (timeController.text.isEmpty) {
        errors['time'] = 'Collection time is required';
      }

      // One-time plans have no duration.
      final durationProblem = durationError(
        durationController.text,
        initialText: initialCollectionDuration.value ?? '',
        isOneTime: int.tryParse(intervalController.text) == 0,
      );
      if (durationProblem != null) {
        errors['duration'] = durationProblem;
      }

      validationErrors.value = errors;
      return errors.isEmpty;
    }

    Widget _buildErrorText(String error) {
      return Padding(
        padding: EdgeInsets.only(top: 4),
        child: Align(
          alignment: Alignment.centerLeft,
          child: Text(
            error,
            style: TextStyle(
              color: AppColors.onErrorLight,
              fontSize: 12,
            ),
          ),
        ),
      );
    }

    final onSavePressed = () async {
      if (!validateAllFields()) {
        scrollToFirstError();
        if (validationErrors.value.isNotEmpty) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: const Text('Please fill all the required fields'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }

      try {
        // Only a changed plan sends its fields (and has visits regenerated).
        final collectionPlanChanged = CollectionPlanFormValues(
          interval: intervalController.text,
          days: selectedDays.value,
          time: timeController.text,
          duration: durationController.text,
        ).differsFrom(CollectionPlanFormValues(
          interval: initialCollectionFrequency.value ?? '',
          days: initialSelectedDays.value,
          time: initialCollectionTime.value ?? '',
          duration: initialCollectionDuration.value ?? '',
        ));

        List<DayOfWeek> convertToDayOfWeek(List<String> selectedDays) {
          final Map<String, DayOfWeek> dayMapping = {
            'sunday': DayOfWeek.sunday,
            'monday': DayOfWeek.monday,
            'tuesday': DayOfWeek.tuesday,
            'wednesday': DayOfWeek.wednesday,
            'thursday': DayOfWeek.thursday,
            'friday': DayOfWeek.friday,
            'saturday': DayOfWeek.saturday,
          };
          return selectedDays
              .map((day) => dayMapping[day.toLowerCase()] ?? DayOfWeek.sunday)
              .toList();
        }

        // Combined photo URLs from ImageUploadGrid
        final allPhotos = uploadedPhotoUrls.value;

        final updateSiteDto = UpdateSiteDto((b) {
          b
            ..name = sitenameController.text
            ..farmType = selectedFarmType.value
            ..siteType = selectedSiteType.value == 'private'
                ? SiteType.private
                : selectedSiteType.value == 'government'
                    ? SiteType.government
                    : SiteType.corporate
            ..siteOwnerName = contactnameController.text
            ..siteOwnerNumber = numberController.text
            ..workerNumber = int.tryParse(noofworkersController.text) ?? 0
            ..address = addressController.text
            ..pinCode = int.tryParse(pincodeController.text) ?? 0
            ..comment = commentController.text
            ..collectionConsent = collectionConsent.value
            ..latitude = double.tryParse(latController.text) ?? 0.0
            ..longitude = double.tryParse(longController.text) ?? 0.0
            ..regionId = selectedDistrictId.value ?? ''
            ..collectionCollector = selectedCollectors.value ?? ''
            // Send the complete list of photos
            ..photos = ListBuilder(allPhotos);

          // Conditionally add collection plan fields
          if (collectionPlanChanged) {
            final days = convertToDayOfWeek(selectedDays.value);
            // intervalController holds the interval value (e.g., 7 for weekly)
            final frequencyInterval =
                int.tryParse(intervalController.text) ?? 7;
            // The API seems to expect frequency as 1, interval sets the period
            final frequency = 1;
            // One-time plans have no duration; validation passed the rest.
            final durationInApiUnits = frequencyInterval == 0
                ? 0
                : durationDaysToSave(
                      durationController.text,
                      initialText: initialCollectionDuration.value ?? '',
                      storedDays: siteDetails.data?.collectionDuration,
                    ) ??
                    0;

            b
              ..collectionFrequencyInterval = frequencyInterval
              ..collectionFrequency = frequency
              ..collectionDayOfWeek = ListBuilder(days)
              ..collectionTime = timeController.text
              ..collectionDuration = durationInApiUnits;
          }
        });

        updateSiteMutation.mutate(updateSiteDto);
      } catch (e) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Failed to update site: ${e.toString()}')),
        );
      }
    };

    return SafeArea(
      child: Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        body: siteDetails.isLoading
            ? const Center(child: CircularProgressIndicator())
            : Column(
                children: <Widget>[
                  HeaderNavigation(
                    title: 'Edit Site',
                    prefix: BackButton(
                        onPressed: () => context.go('/site-details', extra: {
                              'siteId': siteId,
                            })),
                  ),
                  Expanded(
                    child: SingleChildScrollView(
                      controller: scrollController,
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: <Widget>[
                          _buildSection(
                            context: context,
                            title: 'Site Address',
                            content: Column(
                              children: <Widget>[
                                KeyedSubtree(
                                  key: addressKey,
                                  child: AppTextField(
                                    label: 'Address',
                                    placeholder: 'Enter complete address',
                                    controller: addressController,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('address');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['address'] != null)
                                  _buildErrorText(
                                      validationErrors.value['address']!),
                                SizedBox(height: Spacing.space(4)),
                                CustomDropdown<String>(
                                  label: 'State',
                                  options: stateOptions,
                                  value: selectedStateId.value,
                                  onChanged: (value) {
                                    selectedStateId.value = value;
                                    // Clear district selection when state changes
                                    selectedDistrictId.value = null;
                                  },
                                  isLoading: stateRegions.isLoading,
                                ),
                                SizedBox(height: Spacing.space(4)),
                                if (selectedStateId.value != null) ...[
                                  CustomDropdown<String>(
                                    label: 'District',
                                    options: districtOptions,
                                    value: selectedDistrictId.value != null &&
                                            districtOptions.any((option) =>
                                                option.id ==
                                                selectedDistrictId.value)
                                        ? selectedDistrictId.value
                                        : null,
                                    onChanged: (value) =>
                                        selectedDistrictId.value = value,
                                    isLoading: districtRegions.isLoading,
                                  ),
                                  SizedBox(height: Spacing.space(4)),
                                ],
                                KeyedSubtree(
                                  key: pincodeKey,
                                  child: AppTextField(
                                    label: 'Pincode',
                                    placeholder: 'Enter pincode',
                                    controller: pincodeController,
                                    keyboardType: TextInputType.number,
                                    // validator: ValidationHelper.validatePincode,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('pincode');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['pincode'] != null)
                                  _buildErrorText(
                                      validationErrors.value['pincode']!),
                                SizedBox(height: Spacing.space(16)),
                                if (currentMarkerLat.value != null &&
                                    currentMarkerLng.value != null &&
                                    originalLat.value != null &&
                                    originalLng.value != null)
                                  Container(
                                    height: 250,
                                    margin: EdgeInsets.only(bottom: 16),
                                    decoration: BoxDecoration(
                                      borderRadius: BorderRadius.circular(8),
                                      border: Border.all(
                                        color: Colors.grey.shade300,
                                      ),
                                    ),
                                    clipBehavior: Clip.antiAlias,
                                    child: FlutterMap(
                                      key: ValueKey(
                                          '${originalLat.value}-${originalLng.value}'),
                                      options: MapOptions(
                                        initialCenter: LatLng(
                                            originalLat.value!,
                                            originalLng.value!),
                                        initialZoom: 14,
                                      ),
                                      children: [
                                        TileLayer(
                                          urlTemplate:
                                              AppTileProvider.stadiaBright(),
                                          userAgentPackageName:
                                              'com.example.app',
                                        ),
                                        // Circle showing the editable radius boundary
                                        CircleLayer(
                                          circles: [
                                            CircleMarker(
                                              point: LatLng(originalLat.value!,
                                                  originalLng.value!),
                                              radius: LocationEditRadiusKm *
                                                  1000, // Convert km to meters
                                              color:
                                                  Colors.blue.withOpacity(0.1),
                                              borderColor: Colors.blue,
                                              borderStrokeWidth: 2,
                                              useRadiusInMeter: true,
                                            ),
                                          ],
                                        ),
                                        // Draggable marker for editing location
                                        DragMarkers(
                                          markers: [
                                            DragMarker(
                                              point: LatLng(
                                                  currentMarkerLat.value!,
                                                  currentMarkerLng.value!),
                                              size: const Size(40, 40),
                                              offset: const Offset(0, -20),
                                              builder: (context, latLng,
                                                  isDragging) {
                                                return Icon(
                                                  Icons.location_on,
                                                  color: isDragging
                                                      ? Colors.orange
                                                      : Colors.red,
                                                  size: 40,
                                                );
                                              },
                                              onDragEnd: (details, point) {
                                                // Calculate distance from original point
                                                final distance =
                                                    const Distance().as(
                                                  LengthUnit.Kilometer,
                                                  LatLng(originalLat.value!,
                                                      originalLng.value!),
                                                  point,
                                                );

                                                if (distance <=
                                                    LocationEditRadiusKm) {
                                                  // Update marker position and controllers
                                                  currentMarkerLat.value =
                                                      point.latitude;
                                                  currentMarkerLng.value =
                                                      point.longitude;
                                                  latController.text =
                                                      point.latitude.toString();
                                                  longController.text = point
                                                      .longitude
                                                      .toString();
                                                } else {
                                                  // show error
                                                  ScaffoldMessenger.of(context)
                                                      .showSnackBar(
                                                    SnackBar(
                                                        content: Text(
                                                            'Location must be within ${LocationEditRadiusKm.toInt()}km of original site'),
                                                        backgroundColor:
                                                            Colors.red),
                                                  );
                                                  // Trigger rebuild to reset marker position
                                                  currentMarkerLat.value =
                                                      originalLat.value;
                                                  currentMarkerLng.value =
                                                      originalLng.value;
                                                }
                                              },
                                            ),
                                          ],
                                        ),
                                      ],
                                    ),
                                  ),
                              ],
                            ),
                          ),

                          // Contact Details
                          _buildSection(
                            context: context,
                            title: 'Contact Details',
                            content: Column(
                              children: <Widget>[
                                KeyedSubtree(
                                  key: contactNameKey,
                                  child: AppTextField(
                                    label: 'Name',
                                    placeholder: 'Enter contact person name',
                                    controller: contactnameController,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('contactname');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['contactname'] !=
                                    null)
                                  _buildErrorText(
                                      validationErrors.value['contactname']!),
                                SizedBox(height: Spacing.space(4)),
                                KeyedSubtree(
                                  key: phoneKey,
                                  child: AppTextField(
                                    label: 'Phone Number',
                                    placeholder: '+91',
                                    controller: numberController,
                                    keyboardType: TextInputType.phone,
                                    // validator:
                                    //     ValidationHelper.validatePhoneNumber,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('phone');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['phone'] != null)
                                  _buildErrorText(
                                      validationErrors.value['phone']!),
                              ],
                            ),
                          ),

                          // Site Details
                          _buildSection(
                            context: context,
                            title: 'Site Details',
                            content: Column(
                              crossAxisAlignment: CrossAxisAlignment.stretch,
                              children: <Widget>[
                                KeyedSubtree(
                                  key: siteNameKey,
                                  child: AppTextField(
                                    label: 'Name of Site',
                                    placeholder: 'Enter site name',
                                    controller: sitenameController,
                                    // validator: ValidationHelper.validateName,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('sitename');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['sitename'] != null)
                                  _buildErrorText(
                                      validationErrors.value['sitename']!),
                                SizedBox(height: Spacing.space(4)),
                                // Text(
                                //   'Type of Farm',
                                //   style: Theme.of(context)
                                //       .textTheme
                                //       .bodyMedium
                                //       ?.copyWith(
                                //           color: AppColors.labletestblack),
                                // ),
                                Text(
                                  'Type of Farm',
                                  style: AppTypography.textTheme.labelLarge
                                      ?.copyWith(
                                    color:
                                        Theme.of(context).colorScheme.onSurface,
                                  ),
                                ),
                                SizedBox(height: 5),
                                AppRadioGroup<String>(
                                  alignment: WrapAlignment.spaceBetween,
                                  runAlignment: WrapAlignment.spaceBetween,
                                  items: const <AppRadio<String>>[
                                    AppRadio<String>(
                                        value: 'cattle farm',
                                        label: Text('Cattle Farm')),
                                    AppRadio<String>(
                                        value: 'poultry farm',
                                        label: Text('Poultry Farm')),
                                    AppRadio<String>(
                                        value: 'wetland farm',
                                        label: Text('Wetland')),
                                  ],
                                  initialValue: selectedFarmType.value,
                                  onChanged: (value) =>
                                      selectedFarmType.value = value,
                                ),
                                SizedBox(height: Spacing.space(4)),
                                Text(
                                  'Type of Site',
                                  style: AppTypography.textTheme.labelLarge
                                      ?.copyWith(
                                    color:
                                        Theme.of(context).colorScheme.onSurface,
                                  ),
                                  // style: Theme.of(context)
                                  //     .textTheme
                                  //     .bodyMedium
                                  //     ?.copyWith(
                                  //         color: AppColors.labletestblack),
                                ),
                                SizedBox(height: 5),
                                AppRadioGroup<String>(
                                  alignment: WrapAlignment.spaceBetween,
                                  runAlignment: WrapAlignment.spaceBetween,
                                  items: const <AppRadio<String>>[
                                    AppRadio<String>(
                                        value: 'private',
                                        label: Text('Private')),
                                    AppRadio<String>(
                                        value: 'government',
                                        label: Text('Government')),
                                    AppRadio<String>(
                                        value: 'corporate',
                                        label: Text('Corporate')),
                                  ],
                                  initialValue: selectedSiteType.value,
                                  onChanged: (value) =>
                                      selectedSiteType.value = value,
                                ),
                                SizedBox(height: Spacing.space(4)),
                                Text(
                                  'Collection Consent',
                                  style: AppTypography.textTheme.labelLarge
                                      ?.copyWith(
                                    color:
                                        Theme.of(context).colorScheme.onSurface,
                                  ),
                                ),
                                SizedBox(height: 5),
                                KeyedSubtree(
                                  key: consentKey,
                                  child: AppRadioGroup<String>(
                                    items: const <AppRadio<String>>[
                                      AppRadio<String>(
                                          value: 'true', label: Text('Yes')),
                                      AppRadio<String>(
                                          value: 'false', label: Text('No')),
                                    ],
                                    initialValue: collectionConsent.value,
                                    onChanged: (value) {
                                      collectionConsent.value = value;
                                      final newErrors =
                                          Map<String, String>.from(
                                              validationErrors.value);
                                      newErrors.remove('consent');
                                      validationErrors.value = newErrors;
                                    },
                                  ),
                                ),
                                if (validationErrors.value['consent'] != null)
                                  _buildErrorText(
                                      validationErrors.value['consent']!),
                                SizedBox(height: Spacing.space(4)),
                                KeyedSubtree(
                                  key: workersKey,
                                  child: AppTextField(
                                    label: 'No. of Workers',
                                    placeholder: 'Enter Number',
                                    keyboardType: TextInputType.phone,
                                    controller: noofworkersController,
                                    // validator: ValidationHelper.validateWorkers,
                                    onChanged: (value) {
                                      if (value.isNotEmpty) {
                                        final newErrors =
                                            Map<String, String>.from(
                                                validationErrors.value);
                                        newErrors.remove('workers');
                                        validationErrors.value = newErrors;
                                      }
                                    },
                                  ),
                                ),
                                if (validationErrors.value['workers'] != null)
                                  _buildErrorText(
                                      validationErrors.value['workers']!),
                              ],
                            ),
                          ),

                          // Assigning Collectors
                          // _buildSection(
                          //   context: context,
                          //   title: 'Assigning Collectors',
                          //   content: Column(
                          //     children: <Widget>[
                          //       CustomDropdown<String>(
                          //         label: 'Select Collector',
                          //         options: collectorOptions,
                          //         value: selectedCollectors.value,
                          //         onChanged: (value) =>
                          //             selectedCollectors.value = value,
                          //         isLoading: collectorCollectors.isLoading,
                          //       ),
                          //     ],
                          //   ),
                          // ),

                          // Photos & Comments
                          _buildSection(
                            context: context,
                            title: 'Photos & Comments',
                            content: _buildPhotosAndCommentsSection(),
                          ),

                          // Collection Plan
                          // _buildSection(
                          //   context: context,
                          //   title: 'Collection Plan',
                          //   content: EditScheduleCollectionWidget(
                          //     intervalController: intervalController,
                          //     frequencyController: frequencyController,
                          //     dayOfWeekController: dayOfWeekController,
                          //     timeController: timeController,
                          //     durationController: durationController,
                          //     onSubmit: _onSubmit,
                          //   ),
                          // ),

                          Container(
                            decoration: BoxDecoration(
                              color: Colors.white,
                              border: Border(
                                top: BorderSide(
                                    color:
                                        Theme.of(context).colorScheme.outline),
                                bottom: BorderSide(
                                    color:
                                        Theme.of(context).colorScheme.outline),
                              ),
                            ),
                            padding: Spacing.p(3),
                            child: AppButton(
                              width: double.infinity,
                              onPressed: updateSiteMutation.isPending
                                  ? null
                                  : onSavePressed,
                              child: updateSiteMutation.isPending
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                        valueColor:
                                            AlwaysStoppedAnimation<Color>(
                                                Colors.white),
                                      ),
                                    )
                                  : const Text('Update Site'),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
      ),
    );
  }
}
