// ignore_for_file: unused_local_variable, unused_element

import 'dart:async';
import 'package:flutter/foundation.dart' show kIsWeb;

import 'package:design_system/design_system.dart';
import 'package:dio/dio.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/api.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/managers/location_manager.dart';
import 'package:es_platform_mobile/providers/connectivity_provider.dart';
import 'package:es_platform_mobile/services/analytics_service.dart';
import 'package:es_platform_mobile/services/connectivity_service.dart';
import 'package:es_platform_mobile/utils/collection_plan_edit.dart';
import 'package:es_platform_mobile/utils/disease_site_config.dart';
import 'package:es_platform_mobile/utils/extensions/go_router.dart';
import 'package:es_platform_mobile/utils/extensions/validator.dart';
import 'package:es_platform_mobile/utils/map_tile_provider.dart';
import 'package:es_platform_mobile/utils/visit_selection.dart';
import 'package:es_platform_mobile/views/sites/widgets/dropdown.dart';
import 'package:es_platform_mobile/views/sites/widgets/shedulecollection.dart';
import 'package:es_platform_mobile/widgets/image_upload_grid.dart';
import 'package:http/http.dart' as http;
import 'package:flutter/material.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:flutter_map/flutter_map.dart';
import 'package:flutter_map_dragmarker/flutter_map_dragmarker.dart';
import 'package:fquery/fquery.dart';
import 'package:go_router/go_router.dart';
import 'package:hive/hive.dart';
import 'package:latlong2/latlong.dart';

class CreateSite extends HookWidget {
  final String? collectorId;
  final String? origin;

  const CreateSite({
    this.collectorId,
    this.origin,
    super.key,
  });

  @override
  Widget build(BuildContext context) {
    useCacheAllDistricts();
    print(
        "--- CreateSite build --- origin: $origin, collectorId: $collectorId"); // Print origin/collectorId on build
    // Initialize controllers with empty strings
    final sitenameController = useTextEditingController(text: '');
    final noofworkersController = useTextEditingController(text: '');
    final addressController = useTextEditingController(text: '');
    final pincodeController = useTextEditingController(text: '');
    final contactnameController = useTextEditingController(text: '');
    final numberController = useTextEditingController(text: '');
    final timeController = useTextEditingController(text: '');
    final durationController = useTextEditingController(text: '');
    final intervalController = useTextEditingController(text: '');
    final frequencyController = useTextEditingController(text: '');
    final dayOfWeekController = useTextEditingController(text: '');
    final commentController = useTextEditingController(text: '');
    final latController = useTextEditingController(text: '');
    final longController = useTextEditingController(text: '');
    final queryClient = useQueryClient();
    final api = useEsApiClient();
    final projectId = useCurrentProjectId();
    final isSaving = useState(false);
    final currentMarkerLat = useState<double?>(null);
    final currentMarkerLng = useState<double?>(null);
    final mapController = useMemoized(() => MapController());

    final createSiteMutation = useCreateSite(
      onError: (error) async {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Could not create site online. Saving offline...'),
              backgroundColor: Colors.green,
            ),
          );
          Navigator.of(context).pop();
        }
        if (context.mounted) {
          if (context.canPop()) {
            context.pop({'showSuccessSnackbar': true});
          } else {
            context.go('/sites', extra: {'showSuccessSnackbar': true});
          }
        }
      },
    );

    // Effect to handle navigation AFTER site creation succeeds (only for non-AddNewVisit origin)
    useEffect(() {
      // Check if site creation was successful AND origin is NOT AddNewVisit
      if (createSiteMutation.isSuccess &&
          createSiteMutation.data?.id != null &&
          origin != 'AddNewVisit') {
        // Default success path (not from AddNewVisit)
        print(
            "Site created (${createSiteMutation.data!.id}), showing success and navigating (non-AddNewVisit origin)...");
        // Keep SnackBar commented out here
        /* ScaffoldMessenger.of(context).showSnackBar(...) */
        // ScaffoldMessenger.of(context).showSnackBar(
        //   SnackBar(
        //     content: const Text('Site created successfully'),
        //     backgroundColor: AppColors.semanticsGreen20,
        //     duration: const Duration(seconds: 1),
        //   ),
        // );

        // Invalidate the sites query before navigating
        final currentProjectId = queryClient
            .getQueryData<ProjectResponseDataExtended>(QueryKeys.projects)
            ?.id;
        if (currentProjectId != null) {
          print(
              "Invalidating sites query: ${QueryKeys.sites(currentProjectId)}");
          queryClient.invalidateQueries(QueryKeys.sites(currentProjectId));
        } else {
          print("Could not invalidate sites query: projectId is null");
        }

        // Navigate back or to a relevant screen, passing a success indicator
        if (context.canPop()) {
          print("Navigating back with pop({'showSuccessSnackbar': true})");
          context.pop({'showSuccessSnackbar': true});
        } else {
          print(
              "Navigating forward with go('/sites', extra: {'showSuccessSnackbar': true})");
          context
              .go('/sites', extra: {'showSuccessSnackbar': true}); // Fallback
        }
      }
      return null;
    }, [
      createSiteMutation.isSuccess,
      createSiteMutation.data,
      origin,
      // Remove collectorId and siteIdToFetchVisitsFor.value dependency
    ]);

    // Move state variables to hooks
    final selectedDistrictId = useState<String?>(null);
    final selectedStateId = useState<String?>(null);
    final selectedSiteType = useState<String?>(null);
    // 'true' / 'false' as strings (older APKs parse this field as String);
    // new sites default to Yes
    final collectionConsent = useState<String?>('true');
    final selectedFarmType = useState<String?>(null);
    final selectedSiteSubType = useState<String?>(null);
    final selectedDiseaseIds = useState<List<String>>([]);
    final pendingDistrictName = useRef<String>('');
    final nominatimResults = useState<List<Map<String, dynamic>>>([]);
    final nominatimTimer = useRef<Timer?>(null);
    final selectedCollectors = useState<String?>(null);
    final selectedDays = useState<List<String>>([]);
    // The collection start date; as on the web, a new plan starts today
    // unless another date is picked.
    final selectedStartDate =
        useState<DateTime?>(DateUtils.dateOnly(DateTime.now()));
    // uploadedPhotoUrls is kept in sync by ImageUploadGrid via its onChanged callback.
    final uploadedPhotoUrls = useState<List<String>>([]);

    // Use the global ConnectivityService (already pings every 8s + reacts to
    // interface changes). No need for a per-screen HTTP ping.
    final networkStatus = context.networkStatus;
    final isOnline = useState(networkStatus == NetworkStatus.online);
    final isUsingCurrentLocation = useState(false);
    final isSatelliteView = useState(false);
    final isFetchingLocation = useState(false);

    // Get diseases from useProject() hook
    final projectQuery = useProject();
    final projectDiseases = projectQuery.data?.diseases.toList() ?? [];

    // Capture in build — InheritedWidget lookups are not allowed inside useEffect.
    final connectivityService = context.connectivity;

    useEffect(() {
      // Keep isOnline in sync with the global connectivity stream.
      final sub = connectivityService.status.listen((status) {
        isOnline.value = status == NetworkStatus.online;
      });
      return sub.cancel;
    }, [connectivityService]);

    // Lightweight GPS-only fetch used on initial load (no reverse geocoding needed yet)
    Future<void> _fetchGpsOnly() async {
      isFetchingLocation.value = true;
      try {
        final position = await LocationManager.ensureLocation(context);
        if (position != null) {
          currentMarkerLat.value = position.latitude;
          currentMarkerLng.value = position.longitude;
          latController.text = position.latitude.toString();
          longController.text = position.longitude.toString();
          isUsingCurrentLocation.value = true;
          try {
            mapController.move(
                LatLng(position.latitude, position.longitude), 14);
          } catch (e) {
            print('MapController not ready yet');
          }
        }
      } finally {
        isFetchingLocation.value = false;
      }
    }

    useEffect(() {
      _fetchGpsOnly();
      // Track site creation started
      Analytics.siteCreationStarted();
      return null;
    }, []);

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

    void validateField(String field, String? value, String errorMessage) {
      if (value == null || value.isEmpty) {
        validationErrors.value = {
          ...validationErrors.value,
          field: errorMessage,
        };
      } else {
        final newErrors = Map<String, String>.from(validationErrors.value);
        newErrors.remove(field);
        validationErrors.value = newErrors;
      }
    }

    bool validateAllFields() {
      print("--- Running Validation ---");
      final errors = <String, String>{};

      if (selectedDiseaseIds.value.isEmpty) {
        print("Validation failed: diseases empty");
        errors['diseases'] = 'At least one disease selection is required';
      }

      if (sitenameController.text.isEmpty) {
        print("Validation failed: sitename empty");
        errors['sitename'] = 'Site name is required';
      }

      if (selectedFarmType.value == null) {
        print("Validation failed: farmType null");
        errors['farmType'] = 'Farm type is required';
      }

      if (selectedSiteType.value == null) {
        print("Validation failed: siteType null");
        errors['siteType'] = 'Site type is required';
      }

      if (collectionConsent.value == null) {
        print("Validation failed: collectionConsent null");
        errors['consent'] = 'Collection consent is required';
      }

      // if (noofworkersController.text.isEmpty) {
      //   print("Validation failed: workers empty");
      //   errors['workers'] = 'Number of workers is required';
      // }

      if (addressController.text.isEmpty) {
        print("Validation failed: address empty");
        errors['address'] = 'Address is required';
      }

      if (selectedStateId.value == null) {
        print("Validation failed: state null");
        errors['state'] = 'State is required';
      }

      // Only validate district if a state is selected
      if (selectedStateId.value != null && selectedDistrictId.value == null) {
        print("Validation failed: district null (state selected)");
        errors['district'] = 'District is required';
      }

      if (pincodeController.text.isEmpty) {
        print("Validation failed: pincode empty");
        errors['pincode'] = 'Pincode is required';
      }

      if (selectedCollectors.value == null) {
        print("Validation failed: collector null");
        errors['collector'] = 'Need to assign any 1 collector';
      }

      // if (contactnameController.text.isEmpty) {
      //   print("Validation failed: contactname empty");
      //   errors['contactname'] = 'Contact name is required';
      // }

      // if (numberController.text.isEmpty) {
      //   print("Validation failed: phone empty");
      //   errors['phone'] = 'Phone number is required';
      // }

      if (numberController.text.isNotEmpty &&
          numberController.text.length != 10) {
        print("Validation failed: phone invalid length");
        errors['phone'] = 'Enter a valid 10-digit phone number';
      }

      // Schedule related checks
      final startDateProblem =
          startDateError(selectedStartDate.value, today: DateTime.now());
      if (startDateProblem != null) {
        print("Validation failed: start date");
        errors['startDate'] = startDateProblem;
      }

      if (selectedDays.value.isEmpty) {
        print("Validation failed: days empty");
        errors['days'] = 'Collection days are required';
      }

      if (timeController.text.isEmpty) {
        print("Validation failed: time empty");
        errors['time'] = 'Collection time is required';
      }

      // Skip duration check for one-time visits (interval == 0 at API boundary)
      final durationProblem = durationError(
        durationController.text,
        initialText: '',
        isOneTime: int.tryParse(frequencyController.text) == 0,
      );
      if (durationProblem != null) {
        print("Validation failed: duration");
        errors['duration'] = durationProblem;
      }

      validationErrors.value = errors;
      final bool isValid = errors.isEmpty;
      print("Validation result: ${isValid ? 'Success' : 'Failed'}");
      print("--- Finished Validation ---");
      return isValid;
    }

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
        // The plan fields share one widget.
        'startDate': durationKey,
        'days': durationKey,
        'time': durationKey,
        'duration': durationKey,
        'diseases': siteNameKey, // Focus on site name if disease is the issue
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



    // Add region queries
    final stateRegions = useRegions('state');
    final districtRegions = useDistricts(parentId: selectedStateId.value);
    final collectorCollectors = useCollectors(projectId);

    // Convert API response to dropdown options
    final districtOptions = useMemoized<List<CustomDropdownOption<String>>>(() {
      if (districtRegions.data == null) return [];

      try {
        final data = districtRegions.data?.subRegions;
        if (data == null || data.isEmpty) return [];

        final options = data.map((district) {
          final id = district.id;
          final name = district.name;
          if (id.isEmpty || name.isEmpty) return null;
          return CustomDropdownOption<String>(id: id, label: name);
        }).toList();

        return options
            .where((option) => option != null)
            .cast<CustomDropdownOption<String>>()
            .toList();
      } catch (e) {
        print('Error processing district data: $e');
        return [];
      }
    }, [districtRegions.data]);

    final stateOptions = useMemoized<List<CustomDropdownOption<String>>>(() {
      if (stateRegions.data == null) {
        print('State regions data is null');
        return [];
      }

      final data = stateRegions.data as List<RegionResponseData>;
      print('State regions data: $data'); // Debug print
      print('State regions data length: ${data.length}'); // Debug print

      if (data.isEmpty) {
        print('State regions data is empty');
        return [];
      }

      final options = data.map((state) {
        print('Processing state: ${state.id} - ${state.name}'); // Debug print
        return CustomDropdownOption<String>(
          id: state.id,
          label: state.name,
        );
      }).toList();

      print('Generated state options: $options'); // Debug print
      return options;
    }, [stateRegions.data]);

    // Add debug prints for state regions query
    useEffect(() {
      print('State regions loading: ${stateRegions.isLoading}');
      print('State regions error: ${stateRegions.error}');
      print('State regions data: ${stateRegions.data}');
      return null;
    }, [stateRegions.isLoading, stateRegions.error, stateRegions.data]);

    // Get selected state and district names
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

    // Use the coordinates hook
    final coordinates = useLocationCoordinates(selectedDistrict, selectedState);

    // Add _buildErrorText function before it's used
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

    // GPS + Nominatim reverse geocoding to autofill address fields.
    Future<void> fetchCurrentLocation() async {
      isFetchingLocation.value = true;
      try {
        final position = await LocationManager.ensureLocation(context);
        if (position != null) {
          currentMarkerLat.value = position.latitude;
          currentMarkerLng.value = position.longitude;
          latController.text = position.latitude.toString();
          longController.text = position.longitude.toString();
          isUsingCurrentLocation.value = true;
          try {
            mapController.move(
                LatLng(position.latitude, position.longitude), 14);
          } catch (e) {
            print('MapController not ready yet');
          }

          // Reverse geocode using Nominatim to autofill address fields
          try {
            final dio = Dio();
            final response = await dio.get(
              'https://nominatim.openstreetmap.org/reverse',
              queryParameters: {
                'format': 'json',
                'lat': position.latitude,
                'lon': position.longitude,
                'addressdetails': 1,
              },
              options: Options(
                headers: {'User-Agent': 'DhariniApp/1.0 (dharini-support@artpark.in)'},
              ),
            );

            if (response.data is Map) {
              final data = response.data as Map<String, dynamic>;

              // Autofill address field with the display name
              final displayName = data['display_name'] as String?;
              if (displayName != null && displayName.isNotEmpty) {
                addressController.text = displayName;
                final newErrors =
                    Map<String, String>.from(validationErrors.value);
                newErrors.remove('address');
                validationErrors.value = newErrors;
              }

              final address = data['address'] as Map<String, dynamic>?;
              if (address != null) {
                // Parse state and district from Nominatim response
                final stateFromNominatim =
                    (address['state'] as String?)?.toLowerCase().trim() ?? '';
                final districtFromNominatim = [
                      address['state_district'],
                      address['county'],
                      address['district'],
                    ].whereType<String>().firstOrNull?.toLowerCase().trim() ??
                    '';

                // Match & select state from the loaded dropdown options
                final matchedState = stateOptions.firstWhere(
                  (s) =>
                      s.label.toLowerCase().contains(stateFromNominatim) ||
                      stateFromNominatim.contains(s.label.toLowerCase()),
                  orElse: () => CustomDropdownOption<String>(id: '', label: ''),
                );
                if (matchedState.id.isNotEmpty) {
                  // If the state is already active and districts are loaded, match immediately
                  if (selectedStateId.value == matchedState.id &&
                      districtOptions.isNotEmpty) {
                    final matchedDistrict = _findBestRegionMatch(
                        districtFromNominatim, districtOptions);
                    if (matchedDistrict.id.isNotEmpty) {
                      selectedDistrictId.value = matchedDistrict.id;
                      pendingDistrictName.value = '';
                    } else {
                      selectedDistrictId.value = null;
                      pendingDistrictName.value = districtFromNominatim;
                    }
                  } else {
                    selectedStateId.value = matchedState.id;
                    selectedDistrictId.value = null;
                    pendingDistrictName.value = districtFromNominatim;
                  }

                  final newErrors =
                      Map<String, String>.from(validationErrors.value);
                  newErrors.remove('state');
                  validationErrors.value = newErrors;
                }

                // Autofill pincode
                final postcode = address['postcode'] as String?;
                if (postcode != null && postcode.isNotEmpty) {
                  pincodeController.text = postcode
                      .split(RegExp(r'[\s\-,]'))
                      .first
                      .replaceAll(RegExp(r'\D'), '');
                  final newErrors =
                      Map<String, String>.from(validationErrors.value);
                  newErrors.remove('pincode');
                  validationErrors.value = newErrors;
                }
              }
            }
          } catch (e) {
            print('Reverse geocoding failed: $e');
          }
        }
      } finally {
        isFetchingLocation.value = false;
      }
    }

    // Update coordinates effect - updates marker when district/state coordinates are fetched
    useEffect(() {
      if (selectedState == null || selectedState.isEmpty) {
        return;
      }
      if (selectedDistrict == null || selectedDistrict.isEmpty) {
        return;
      }
      if (coordinates.isLoading) {
        return;
      }
      if (coordinates.error != null) {
        print('Error getting coordinates: ${coordinates.error}');
        return;
      }
      if (coordinates.data != null) {
        final coords = coordinates.data as Map<String, dynamic>?;
        if (coords != null &&
            coords['latitude'] != null &&
            coords['longitude'] != null) {
          latController.text = coords['latitude'].toString();
          longController.text = coords['longitude'].toString();
          currentMarkerLat.value = coords['latitude'] as double;
          currentMarkerLng.value = coords['longitude'] as double;
          isUsingCurrentLocation.value = false;
          try {
            mapController.move(
                LatLng(coords['latitude'] as double,
                    coords['longitude'] as double),
                14);
          } catch (e) {
            print('[Coordinates] MapController not ready yet');
          }
        }
      }
      return null;
    }, [
      coordinates.data,
      coordinates.isLoading,
      coordinates.error,
      selectedDistrictId.value,
      selectedDistrict,
      selectedState
    ]);

    final collectorOptions =
        useMemoized<List<CustomDropdownOption<String>>>(() {
      if (collectorCollectors.data == null) {
        print('Collector data is null');
        return [];
      }
      // final data = collectorCollectors.data as List<UserResponseType>;
      final data = collectorCollectors.data as List<User>;
      print('Creating collector options from: $data');
      return data
          .map((collector) => CustomDropdownOption<String>(
                id: collector.id,
                label: '${collector.firstName} ${collector.lastName}',
              ))
          .toList();
    }, [collectorCollectors.data]);

    Map<String, dynamic>? collectionData;

    void _handleScheduleSubmit(
      int collectionFrequencyInterval,
      int collectionFrequency,
      List<String> collectionDayOfWeek,
      String collectionTime,
      int collectionDuration,
    ) {
      print('Interval: $collectionFrequencyInterval');
      print('Frequency: $collectionFrequency');
      print('Days: $collectionDayOfWeek');
      print('Time: $collectionTime');
      print('Duration: $collectionDuration');

      // Handle logic: Save to Hive, send to API, etc.
    }

    void _onSubmit(
      int collectionFrequencyInterval,
      int collectionFrequency,
      List<String> collectionDayOfWeek,
      String collectionTime,
      int collectionDuration,
      DateTime collectionStartDate,
    ) {
      selectedDays.value = collectionDayOfWeek;
      selectedStartDate.value = collectionStartDate; // Store the start date
      if (validationErrors.value.containsKey('startDate')) {
        validationErrors.value = Map<String, String>.from(validationErrors.value)
          ..remove('startDate');
      }
      if (collectionDuration > 0) {
        final newErrors = Map<String, String>.from(validationErrors.value);
        newErrors.remove('duration');
        validationErrors.value = newErrors;
      }
      print('=== Collection Plan Submitted ===');
      print('Selected days: ${selectedDays.value}');
      print('Collection frequency interval: $collectionFrequencyInterval');
      print('Collection start date: $collectionStartDate');
      print(
          'Collection start date (ISO): ${collectionStartDate.toIso8601String()}');
      print('=================================');
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
                Text(
                  title,
                  style: Theme.of(context).textTheme.headlineMedium,
                ),
                SizedBox(height: Spacing.space(2)),
                content,
              ],
            ),
          ),
        );

    // Create a new PhotosAndCommentsSection widget
    Widget _buildPhotosAndCommentsSection() {
      return Padding(
          padding: EdgeInsets.symmetric(horizontal: Spacing.space(4)),
          child: Container(
              decoration: BoxDecoration(
                color: Colors.white,
              ),
              child: Column(
                mainAxisAlignment: MainAxisAlignment.start,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: <Widget>[
                  if (isOnline.value) ...[
                    Text(
                      'Add Photos',
                      style: AppTypography.textTheme.bodyB2Medium.copyWith(
                        color: AppColors.textStrong,
                      ),
                    ),
                    const SizedBox(height: 8),
                    ImageUploadGrid(
                      onChanged: (urls) => uploadedPhotoUrls.value = urls,
                    ),
                    const SizedBox(height: 16),
                  ],
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
                    placeholder: 'Add your comments here...',
                    helperText: '0/200',
                    textInputAction: TextInputAction.done,
                    controller: commentController,
                  )
                ],
              )));
    }

    Widget _buildCollectorsSection(BuildContext context) {
      return _buildSection(
        context: context,
        title: 'Assigning Collectors',
        content: Column(
          children: <Widget>[
            KeyedSubtree(
              key: collectorKey,
              child: CustomDropdown<String>(
                label: 'Select Collector',
                options: collectorOptions,
                value: selectedCollectors.value,
                onChanged: (value) {
                  selectedCollectors.value = value;
                  final newErrors =
                      Map<String, String>.from(validationErrors.value);
                  newErrors.remove('collector');
                  validationErrors.value = newErrors;
                },
                isLoading: collectorCollectors.isLoading,
              ),
            ),
            if (validationErrors.value['collector'] != null)
              _buildErrorText(validationErrors.value['collector']!),
          ],
        ),
      );
    }

    Widget _buildContactDetailsSection(BuildContext context) {
      return _buildSection(
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
                        Map<String, String>.from(validationErrors.value);
                    newErrors.remove('contactname');
                    validationErrors.value = newErrors;
                  }
                },
              ),
            ),
            if (validationErrors.value['contactname'] != null)
              _buildErrorText(validationErrors.value['contactname']!),
            SizedBox(height: Spacing.space(4)),
            KeyedSubtree(
              key: phoneKey,
              child: AppTextField(
                label: 'Phone Number',
                placeholder: '9876543210',
                controller: numberController,
                keyboardType: TextInputType.phone,
                // validator: ValidationHelper.validatePhoneNumber,
                onChanged: (value) {
                  // Remove all non-digit characters immediately
                  final digitsOnly = value.replaceAll(RegExp(r'[^0-9]'), '');

                  // Update the controller text only if something was removed
                  if (digitsOnly != value) {
                    numberController.text = digitsOnly;
                    numberController.selection = TextSelection.fromPosition(
                      TextPosition(offset: digitsOnly.length),
                    );
                  }

                  if (digitsOnly.isNotEmpty) {
                    final newErrors =
                        Map<String, String>.from(validationErrors.value);
                    newErrors.remove('phone');
                    validationErrors.value = newErrors;
                  }
                },
              ),
            ),
            if (validationErrors.value['phone'] != null)
              _buildErrorText(validationErrors.value['phone']!),
          ],
        ),
      );
    }

    Widget _buildCollectionPlanSection(BuildContext context) {
      return _buildSection(
        context: context,
        title: 'Collection Plan',
        content: Column(
          mainAxisAlignment: MainAxisAlignment.start,
          crossAxisAlignment: CrossAxisAlignment.start,
          children: <Widget>[
            KeyedSubtree(
              key: durationKey,
              child: ScheduleCollectionWidget(
                intervalController: intervalController,
                frequencyController: frequencyController,
                dayOfWeekController: dayOfWeekController,
                timeController: timeController,
                durationController: durationController,
                onSubmit:
                    (interval, frequency, days, time, duration, startDate) {
                  selectedDays.value = days;
                  // Clear duration error: for Once (interval=0) duration=0 is valid
                  if (duration > 0 || interval == 0) {
                    final newErrors =
                        Map<String, String>.from(validationErrors.value);
                    newErrors.remove('duration');
                    validationErrors.value = newErrors;
                  }
                  _onSubmit(
                      interval, frequency, days, time, duration, startDate);
                },
              ),
            ),
            if (validationErrors.value['startDate'] != null)
              _buildErrorText(validationErrors.value['startDate']!),
            if (validationErrors.value['duration'] != null)
              _buildErrorText(validationErrors.value['duration']!),
          ],
        ),
      );
    }

    // ─── Nominatim address search ───
    Future<void> fetchNominatimSuggestions(String query) async {
      if (query.length < 3) {
        nominatimResults.value = [];
        return;
      }
      try {
        final dio = Dio();
        final response = await dio.get(
          'https://nominatim.openstreetmap.org/search',
          queryParameters: {
            'format': 'json',
            'q': query,
            'addressdetails': 1,
            'limit': 5,
            'countrycodes': 'in',
          },
          options: Options(
              headers: {'User-Agent': 'DhariniApp/1.0 (dharini-support@artpark.in)'}),
        );
        if (response.data is List) {
          nominatimResults.value =
              List<Map<String, dynamic>>.from(response.data);
        }
      } catch (_) {
        nominatimResults.value = [];
      }
    }

    void onAddressChanged(String value) {
      nominatimTimer.value?.cancel();
      nominatimTimer.value = Timer(const Duration(milliseconds: 500), () {
        fetchNominatimSuggestions(value);
      });
      if (value.isNotEmpty) {
        final newErrors = Map<String, String>.from(validationErrors.value);
        newErrors.remove('address');
        validationErrors.value = newErrors;
      }
    }

    void onNominatimSelect(Map<String, dynamic> result) {
      final displayName = result['display_name'] as String? ?? '';
      final lat = double.tryParse(result['lat'] as String? ?? '') ?? 0.0;
      final lon = double.tryParse(result['lon'] as String? ?? '') ?? 0.0;
      addressController.text = displayName;
      nominatimResults.value = [];
      // Update map marker and coords
      currentMarkerLat.value = lat;
      currentMarkerLng.value = lon;
      latController.text = lat.toString();
      longController.text = lon.toString();
      try {
        mapController.move(LatLng(lat, lon), 14);
      } catch (_) {}

      // Try to auto-select state / district from address details
      final address = result['address'] as Map<String, dynamic>?;
      if (address != null) {
        final stateFromNominatim =
            (address['state'] as String?)?.toLowerCase().trim() ?? '';
        final districtFromNominatim = [
              address['state_district'],
              address['county'],
              address['district'],
            ].whereType<String>().firstOrNull?.toLowerCase().trim() ??
            '';

        // Match state
        final matchedState = stateOptions.firstWhere(
          (s) =>
              s.label.toLowerCase().contains(stateFromNominatim) ||
              stateFromNominatim.contains(s.label.toLowerCase()),
          orElse: () => CustomDropdownOption<String>(id: '', label: ''),
        );
        if (matchedState.id.isNotEmpty) {
          // If the state is already active and districts are loaded, match immediately
          if (selectedStateId.value == matchedState.id &&
              districtOptions.isNotEmpty) {
            final matchedDistrict =
                _findBestRegionMatch(districtFromNominatim, districtOptions);
            if (matchedDistrict.id.isNotEmpty) {
              selectedDistrictId.value = matchedDistrict.id;
              pendingDistrictName.value = '';
            } else {
              selectedDistrictId.value = null;
              pendingDistrictName.value = districtFromNominatim;
            }
          } else {
            selectedStateId.value = matchedState.id;
            selectedDistrictId.value = null;
            pendingDistrictName.value = districtFromNominatim;
          }
        }

        // Auto-fill pincode from Nominatim postcode
        final postcode = address['postcode'] as String?;
        if (postcode != null && postcode.isNotEmpty) {
          // Nominatim sometimes returns ranges like "560001 - 560099", take first
          pincodeController.text = postcode
              .split(RegExp(r'[\s\-,]'))
              .first
              .replaceAll(RegExp(r'\D'), '');
        }
      }
    }

    // ─── Auto-match district when districtOptions load ───
    useEffect(() {
      if (pendingDistrictName.value.isNotEmpty && districtOptions.isNotEmpty) {
        final matched =
            _findBestRegionMatch(pendingDistrictName.value, districtOptions);
        if (matched.id.isNotEmpty) {
          selectedDistrictId.value = matched.id;
          pendingDistrictName.value = ''; // clear after matching
        }
      }
      return null;
    }, [districtOptions]);

    SiteType? siteTypeFromString(String? value) {
      if (value == null) return null;
      return SiteType.values.firstWhere(
        (e) => e.name == value,
        orElse: () => SiteType.unknownDefaultOpenApi,
      );
    }

    // Create site button pressed ===>>>
    Future<void> onSavePressed() async {
      if (!validateAllFields()) {
        scrollToFirstError();
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Please fill all the required fields'),
              backgroundColor: Colors.red,
            ),
          );
        }
        return;
      }
      isSaving.value = true;

      try {
        final position = await LocationManager.ensureLocation(context);
        if (position == null) {
          if (context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(content: Text('Location is required')),
            );
          }
          isSaving.value = false;
          return;
        }

        double latitude;
        double longitude;

        if (currentMarkerLat.value != null && currentMarkerLng.value != null) {
          latitude = currentMarkerLat.value!;
          longitude = currentMarkerLng.value!;
          print(
              '[Save] Using marker coordinates: (lat=$latitude, lon=$longitude)');
        } else {
          // Fallback to GPS position if marker wasn't initialized
          latitude = position.latitude;
          longitude = position.longitude;
          print(
              '[Save] Marker not set, using GPS fallback: (lat=$latitude, lon=$longitude)');
        }

        print('[Save] Final location: (lat=$latitude, lon=$longitude)');

        final localSiteId = await createLocalSite(
          name: sitenameController.text,
          address: addressController.text,
          siteOwnerName: contactnameController.text,
          siteOwnerNumber: numberController.text,
          siteType:
              siteTypeFromString(selectedSiteType.value) ?? SiteType.private,
          farmType: selectedFarmType.value ?? '',
          siteSubType: selectedSiteSubType.value,
          diseases: selectedDiseaseIds.value.isEmpty
              ? null
              : projectDiseases
                  .where((d) => selectedDiseaseIds.value.contains(d.id))
                  .toList(),
          pinCode: int.tryParse(pincodeController.text) ?? 0,
          workerNumber: int.tryParse(noofworkersController.text) ?? 0,
          comment: commentController.text,
          time: timeController.text,
          duration: int.tryParse(durationController.text) ?? 0,
          frequencyInterval: int.tryParse(frequencyController.text) ?? 7,
          selectedDays: selectedDays.value,
          regionId: selectedDistrictId.value ?? '',
          photoUrls: uploadedPhotoUrls.value,
          collectionCollector: selectedCollectors.value ?? '',
          latitude: latitude,
          longitude: longitude,
          collectionStartDate: selectedStartDate.value?.toDate(),
          collectionConsent: collectionConsent.value,
        );

        // context.canPop()
        //     ? context.pop({'showSuccessSnackbar': true})
        //     : context.go('/sites', extra: {'showSuccessSnackbar': true});

        // After site creation
        final siteBox = Hive.isBoxOpen('sites')
            ? Hive.box('sites')
            : await Hive.openBox('sites');
        final siteSerialized = siteBox.get(localSiteId);

        if (siteSerialized == null) {
          throw Exception("Local site data not found for id $localSiteId");
        }

        final localSite = standardSerializers.deserializeWith(
            SiteResponseData.serializer, siteSerialized);

        final now = DateTime.now().toUtc();

        // As on the web, a plan starting on a later day gets no visit until
        // its start date. A visit posted today would sort before the
        // start-date visit and take round 1.
        final startDate = selectedStartDate.value;
        final startsLater = planStartsAfterToday(startDate, now);

        final localVisitId = startsLater
            ? null
            : await createLocalVisit(
                siteId: localSite!.id,
                collectorId: selectedCollectors.value ?? '',
                scheduledAt: now,
                comment: commentController.text,
                attachToOverdue: true,
              );

        final visitBox = Hive.box('visits');
        final visitSerialized =
            localVisitId == null ? null : visitBox.get(localVisitId);

        final firstVisit = visitSerialized != null
            ? standardSerializers.deserializeWith(
                VisitResponseData.serializer, visitSerialized)
            : null;

        if (localVisitId != null && firstVisit == null) {
          throw Exception("Visit creation failed, no data found.");
        }

        // Sync to backend if online
        if (isOnline.value && projectId != null && projectId.isNotEmpty) {
          try {
            print('[Sync] Syncing newly created site...');
            await syncChangesToServerQueue(api, projectId)
                .timeout(const Duration(seconds: 20));
            print('[Sync] Site and visit synced successfully');
          } catch (syncError) {
            // Retry once after a short delay — transient network hiccup.
            print('[Sync] First sync attempt failed: $syncError. Retrying...');
            await Future.delayed(const Duration(seconds: 3));
            try {
              await syncChangesToServerQueue(api, projectId)
                  .timeout(const Duration(seconds: 20));
              print('[Sync] Retry sync succeeded');
            } catch (retryError) {
              // Queue entry remains; background sync will pick it up later.
              print('[Sync] Retry also failed: $retryError');
            }
          }
        } else {
          print(
              '[Sync] Skipping sync - offline or no project ID. Project ID: $projectId, isOnline: ${isOnline.value}');
        }

        // Invalidate sites query to show the newly created site immediately
        final currentProjectId = queryClient
            .getQueryData<ProjectResponseDataExtended>(QueryKeys.projects)
            ?.id;
        if (currentProjectId != null) {
          print(
              "Invalidating sites query: ${QueryKeys.sites(currentProjectId)}");
          queryClient.invalidateQueries(QueryKeys.sites(currentProjectId));
        }

        // Track site creation success
        Analytics.siteCreated(
          siteType: selectedSiteType.value,
          farmType: selectedFarmType.value,
          isOffline: !isOnline.value,
        );

        // Once synced, the visit may have merged into the plan's earliest
        // overdue round. Start that round, so the scheduled date is the one
        // being collected rather than today.
        final visitIdMapBox = Hive.isBoxOpen('visitIdMap')
            ? Hive.box('visitIdMap')
            : await Hive.openBox('visitIdMap');
        final mergedVisitId = localVisitId == null
            ? null
            : visitIdMapBox.get(localVisitId) as String?;
        final mergedSerialized =
            mergedVisitId == null ? null : visitBox.get(mergedVisitId);
        final startVisit = mergedSerialized != null
            ? standardSerializers.deserializeWith(
                    VisitResponseData.serializer, mergedSerialized) ??
                firstVisit
            : firstVisit;

        if (context.mounted) {
          if (origin == 'AddNewVisit' && startsLater) {
            // Nothing to collect yet: the first visit is on the start date.
            final firstDay = startDate!;
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text(
                    'Site created. Its first collection is on ${firstDay.day.toString().padLeft(2, '0')}/${firstDay.month.toString().padLeft(2, '0')}/${firstDay.year}.'),
                backgroundColor: Colors.green,
              ),
            );
            context.go('/sites', extra: {'showSuccessSnackbar': false});
          } else if (origin == 'AddNewVisit') {
            if (startVisit != null) {
              context.pushReplacement('/AddvisitDetails', extra: {
                'visitDetails': startVisit,
                'collectorId': selectedCollectors.value ?? '',
                'showSuccessSnackbar': true,
              });
            } else {
              ScaffoldMessenger.of(context).showSnackBar(
                const SnackBar(
                  content: Text(
                      'Site created but visit data is missing. Please try again.'),
                  backgroundColor: Colors.red,
                ),
              );
              context.go('/sites', extra: {'showSuccessSnackbar': false});
            }
          } else {
            context.go('/sites', extra: {'showSuccessSnackbar': true});
          }
        }
      } catch (e, stack) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to save site locally: $e'),
              backgroundColor: Colors.red,
            ),
          );
          print(
              'Failed to save site locally. ERROR: $e \nSTACK TRACE:\n$stack');
        }
      } finally {
        isSaving.value = false;
      }
    }

    // final onSavePressed = () async {
    //   if (!validateAllFields()) {
    //     scrollToFirstError();
    //     if (validationErrors.value.isNotEmpty) {
    //       ScaffoldMessenger.of(context).showSnackBar(
    //         SnackBar(
    //           content: const Text('Please fill all the required fields'),
    //           backgroundColor: Colors.red,
    //         ),
    //       );
    //     }
    //     return;
    //   }

    //   try {
    //     // Convert selected days to DayOfWeek enum values
    //     List<DayOfWeek> convertToDayOfWeek(List<String> selectedDays) {
    //       final Map<String, DayOfWeek> dayMapping = {
    //         'sunday': DayOfWeek.sunday,
    //         'monday': DayOfWeek.monday,
    //         'tuesday': DayOfWeek.tuesday,
    //         'wednesday': DayOfWeek.wednesday,
    //         'thursday': DayOfWeek.thursday,
    //         'friday': DayOfWeek.friday,
    //         'saturday': DayOfWeek.saturday,
    //       };

    //       return selectedDays.map((day) {
    //         final enumValue = dayMapping[day.toLowerCase()];
    //         if (enumValue == null) {
    //           print('Warning: Invalid day value: $day');
    //           return DayOfWeek.sunday; // Default value
    //         }
    //         return enumValue;
    //       }).toList();
    //     }

    //     final days = convertToDayOfWeek(selectedDays.value);
    //     print('Selected days: ${selectedDays.value}');
    //     print('Converted to enum values: $days');

    //     // Get the frequency interval from the controller
    //     final frequencyInterval = int.tryParse(frequencyController.text) ?? 7;
    //     print('Using frequency interval: $frequencyInterval');

    //     final createSiteDto = CreateSiteDto((b) => b
    //       ..name = sitenameController.text
    //       ..farmType = selectedFarmType.value == 'cattle farm'
    //           ? FarmType.cattleFarm
    //           : selectedFarmType.value == 'poultry farm'
    //               ? FarmType.poultryFarm
    //               : FarmType.wetlandFarm
    //       ..siteType = selectedSiteType.value == 'private'
    //           ? SiteType.private
    //           : selectedSiteType.value == 'government'
    //               ? SiteType.government
    //               : SiteType.corporate
    //       ..siteOwnerName = contactnameController.text
    //       ..siteOwnerNumber = numberController.text
    //       ..workerNumber = int.tryParse(noofworkersController.text) ?? 0
    //       ..siteCode = "5" + Random().nextInt(1000000).toString()
    //       ..address = addressController.text
    //       ..pinCode = int.tryParse(pincodeController.text) ?? 0
    //       ..comment = commentController.text
    //       ..latitude = double.tryParse(latController.text) ?? 0.0
    //       ..longitude = double.tryParse(longController.text) ?? 0.0
    //       ..collectionFrequencyInterval = frequencyInterval
    //       ..collectionFrequency = 1
    //       ..collectionDayOfWeek = ListBuilder(days)
    //       ..collectionTime = timeController.text
    //       ..collectionDuration =
    //           (int.tryParse(durationController.text) ?? 0) * 30
    //       ..regionId = selectedDistrictId.value ?? ''
    //       ..collectionCollector = selectedCollectors.value ?? ''
    //       ..photos = ListBuilder(uploadedPhotoUrls.value));

    //     print('Submitting site with photos: ${uploadedPhotoUrls.value}');
    //     createSiteMutation.mutate(createSiteDto);
    //     // ScaffoldMessenger.of(context).showSnackBar(
    //     //   SnackBar(
    //     //     content: const Text('Site created successfully'),
    //     //     backgroundColor: AppColors.semanticsGreen20,
    //     //     duration: const Duration(seconds: 1),
    //     //   ),
    //     // );
    //   } catch (e) {
    //     ScaffoldMessenger.of(context).showSnackBar(
    //       SnackBar(content: Text('Failed to create site: ${e.toString()}')),
    //     );
    //   }
    // };

    return SafeArea(
      child: Scaffold(
        backgroundColor: Theme.of(context).colorScheme.surface,
        body: Column(
          children: <Widget>[
            // Header Navigation
            HeaderNavigation(
              title: 'Create Site',
              prefix: BackButton(onPressed: () {
                if (origin == 'AddNewVisit') {
                  context.go('/AddNewVisit', extra: {
                    'collectorId': collectorId ?? '',
                  });
                } else {
                  context.go('/sites', extra: {'showSuccessSnackbar': false});
                }
              }),
            ),

            // Content
            Expanded(
              child: SingleChildScrollView(
                controller: scrollController,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: <Widget>[
                    // Site Details Section
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
                              validator: ValidationHelper.validateName,
                              onChanged: (value) {
                                if (value.isNotEmpty) {
                                  final newErrors = Map<String, String>.from(
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

                          // ─── Disease Selection ───
                          Builder(builder: (ctx) {
                            final diseases = projectDiseases;
                            if (diseases.isEmpty)
                              return const SizedBox.shrink();
                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(
                                  'Diseases',
                                  style: AppTypography.textTheme.labelLarge
                                      ?.copyWith(
                                    color: Theme.of(ctx).colorScheme.onSurface,
                                  ),
                                ),
                                const SizedBox(height: 8),
                                Wrap(
                                  spacing: 8,
                                  runSpacing: 4,
                                  children: diseases.map((d) {
                                    final isSelected =
                                        selectedDiseaseIds.value.contains(d.id);
                                    return ChoiceChip(
                                      label: Text(d.shortName),
                                      selected: isSelected,
                                      onSelected: (val) {
                                        if (val) {
                                          selectedDiseaseIds.value = [
                                            ...selectedDiseaseIds.value,
                                            d.id
                                          ];
                                        } else {
                                          selectedDiseaseIds.value =
                                              selectedDiseaseIds.value
                                                  .where((id) => id != d.id)
                                                  .toList();
                                        }
                                        selectedFarmType.value = null;
                                        selectedSiteSubType.value = null;
                                      },
                                    );
                                  }).toList(),
                                ),
                                if (validationErrors.value['diseases'] != null)
                                  _buildErrorText(
                                      validationErrors.value['diseases']!),
                                SizedBox(height: Spacing.space(4)),
                              ],
                            );
                          }),

                          // ─── Dynamic Farm Type (based on selected diseases) ───
                          Builder(builder: (ctx) {
                            final diseases = projectDiseases;
                            final selectedShortNames = diseases
                                .where((d) =>
                                    selectedDiseaseIds.value.contains(d.id))
                                .map((d) => d.shortName)
                                .where((s) => s.isNotEmpty)
                                .toList();
                            final siteOptions =
                                getSiteOptionsForDiseases(selectedShortNames);
                            if (siteOptions.isEmpty)
                              return const SizedBox.shrink();

                            final selectedOption = siteOptions.firstWhere(
                              (o) => o.value == selectedFarmType.value,
                              orElse: () =>
                                  DiseaseSiteOption(value: '', label: ''),
                            );
                            final subtypes = selectedOption.subtypes ?? [];

                            return Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                KeyedSubtree(
                                  key: farmTypeKey,
                                  child: Column(
                                    crossAxisAlignment:
                                        CrossAxisAlignment.start,
                                    children: [
                                      Text(
                                        'Farm Type',
                                        style: AppTypography
                                            .textTheme.labelLarge
                                            ?.copyWith(
                                          color: Theme.of(ctx)
                                              .colorScheme
                                              .onSurface,
                                        ),
                                      ),
                                      const SizedBox(height: 8),
                                      Wrap(
                                        spacing: 8,
                                        runSpacing: 4,
                                        children: siteOptions.map((opt) {
                                          final isChipSelected =
                                              selectedFarmType.value ==
                                                  opt.value;
                                          return ChoiceChip(
                                            label: Text(opt.label),
                                            selected: isChipSelected,
                                            onSelected: (_) {
                                              selectedFarmType.value =
                                                  opt.value;
                                              selectedSiteSubType.value = null;
                                              final errs =
                                                  Map<String, String>.from(
                                                      validationErrors.value);
                                              errs.remove('farmType');
                                              validationErrors.value = errs;
                                            },
                                          );
                                        }).toList(),
                                      ),
                                    ],
                                  ),
                                ),
                                if (validationErrors.value['farmType'] != null)
                                  _buildErrorText(
                                      validationErrors.value['farmType']!),
                                if (subtypes.isNotEmpty) ...[
                                  SizedBox(height: Spacing.space(3)),
                                  Text(
                                    'Sub Type',
                                    style: AppTypography.textTheme.labelLarge
                                        ?.copyWith(
                                      color:
                                          Theme.of(ctx).colorScheme.onSurface,
                                    ),
                                  ),
                                  const SizedBox(height: 8),
                                  Wrap(
                                    spacing: 8,
                                    runSpacing: 4,
                                    children: subtypes.map((sub) {
                                      final isSel = selectedSiteSubType.value ==
                                          sub.value;
                                      return ChoiceChip(
                                        label: Text(sub.label),
                                        selected: isSel,
                                        onSelected: (_) {
                                          selectedSiteSubType.value = sub.value;
                                        },
                                      );
                                    }).toList(),
                                  ),
                                ],
                                SizedBox(height: Spacing.space(4)),
                              ],
                            );
                          }),

                          // ─── Site Type (Ownership) ───
                          Text(
                            'Site Type',
                            style: AppTypography.textTheme.labelLarge?.copyWith(
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          KeyedSubtree(
                            key: siteTypeKey,
                            child: AppRadioGroup<String>(
                              alignment: WrapAlignment.spaceBetween,
                              runAlignment: WrapAlignment.spaceBetween,
                              items: const <AppRadio<String>>[
                                AppRadio<String>(
                                  value: 'private',
                                  label: Text('Private'),
                                ),
                                AppRadio<String>(
                                  value: 'government',
                                  label: Text('Government'),
                                ),
                                AppRadio<String>(
                                  value: 'corporate',
                                  label: Text('Corporate'),
                                ),
                              ],
                              onChanged: (value) {
                                selectedSiteType.value = value;
                                final newErrors = Map<String, String>.from(
                                    validationErrors.value);
                                newErrors.remove('siteType');
                                validationErrors.value = newErrors;
                              },
                            ),
                          ),
                          if (validationErrors.value['siteType'] != null)
                            _buildErrorText(
                                validationErrors.value['siteType']!),
                          SizedBox(height: Spacing.space(4)),

                          // ─── Collection Consent (Yes/No) ───
                          Text(
                            'Collection Consent',
                            style: AppTypography.textTheme.labelLarge?.copyWith(
                              color: Theme.of(context).colorScheme.onSurface,
                            ),
                          ),
                          KeyedSubtree(
                            key: consentKey,
                            child: AppRadioGroup<String>(
                              initialValue: collectionConsent.value,
                              items: const <AppRadio<String>>[
                                AppRadio<String>(
                                  value: 'true',
                                  label: Text('Yes'),
                                ),
                                AppRadio<String>(
                                  value: 'false',
                                  label: Text('No'),
                                ),
                              ],
                              onChanged: (value) {
                                collectionConsent.value = value;
                                final newErrors = Map<String, String>.from(
                                    validationErrors.value);
                                newErrors.remove('consent');
                                validationErrors.value = newErrors;
                              },
                            ),
                          ),
                          if (validationErrors.value['consent'] != null)
                            _buildErrorText(validationErrors.value['consent']!),
                          SizedBox(height: Spacing.space(4)),
                          KeyedSubtree(
                            key: workersKey,
                            child: AppTextField(
                              label: 'No. of Workers',
                              placeholder: 'Enter Number',
                              keyboardType: TextInputType.number,
                              controller: noofworkersController,
                              onChanged: (value) {
                                if (value.isNotEmpty) {
                                  final newErrors = Map<String, String>.from(
                                      validationErrors.value);
                                  newErrors.remove('workers');
                                  validationErrors.value = newErrors;
                                }
                              },
                            ),
                          ),
                          if (validationErrors.value['workers'] != null)
                            _buildErrorText(validationErrors.value['workers']!),
                        ],
                      ),
                    ),

                    // Site Address Section
                    _buildSection(
                      context: context,
                      title: 'Site Address',
                      content: Column(
                        children: <Widget>[
                          // ─── Nominatim Address Autocomplete ───
                          KeyedSubtree(
                            key: addressKey,
                            child: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                AppTextField(
                                  label: 'Address',
                                  placeholder:
                                      'Start typing to search address...',
                                  controller: addressController,
                                  onChanged: onAddressChanged,
                                ),
                                if (nominatimResults.value.isNotEmpty)
                                  Material(
                                    elevation: 4,
                                    borderRadius: BorderRadius.circular(8),
                                    child: ListView.separated(
                                      shrinkWrap: true,
                                      physics: const ClampingScrollPhysics(),
                                      itemCount: nominatimResults.value.length,
                                      separatorBuilder: (_, __) =>
                                          const Divider(height: 1),
                                      itemBuilder: (_, i) {
                                        final result =
                                            nominatimResults.value[i];
                                        final displayName =
                                            result['display_name'] as String? ??
                                                '';
                                        return ListTile(
                                          dense: true,
                                          leading: const Icon(Icons.location_on,
                                              size: 18),
                                          title: Text(
                                            displayName,
                                            maxLines: 2,
                                            overflow: TextOverflow.ellipsis,
                                            style:
                                                const TextStyle(fontSize: 13),
                                          ),
                                          onTap: () =>
                                              onNominatimSelect(result),
                                        );
                                      },
                                    ),
                                  ),
                              ],
                            ),
                          ),
                          if (validationErrors.value['address'] != null)
                            _buildErrorText(validationErrors.value['address']!),
                          SizedBox(height: Spacing.space(4)),
                          KeyedSubtree(
                            key: stateKey,
                            child: CustomDropdown<String>(
                              label: 'State',
                              options: stateOptions,
                              value: selectedStateId.value,
                              onChanged: (value) {
                                selectedStateId.value = value;
                                selectedDistrictId.value = null;
                                final newErrors = Map<String, String>.from(
                                    validationErrors.value);
                                newErrors.remove('state');
                                validationErrors.value = newErrors;
                              },
                              isLoading: stateRegions.isLoading,
                            ),
                          ),
                          if (validationErrors.value['state'] != null)
                            _buildErrorText(validationErrors.value['state']!),
                          SizedBox(height: Spacing.space(4)),
                          if (selectedStateId.value != null) ...[
                            KeyedSubtree(
                              key: districtKey,
                              child: CustomDropdown<String>(
                                label: 'District',
                                options: districtOptions,
                                value: selectedDistrictId.value,
                                onChanged: (value) {
                                  selectedDistrictId.value = value;
                                  final newErrors = Map<String, String>.from(
                                      validationErrors.value);
                                  newErrors.remove('district');
                                  validationErrors.value = newErrors;
                                },
                                isLoading: districtRegions.isLoading,
                              ),
                            ),
                            if (validationErrors.value['district'] != null)
                              _buildErrorText(
                                  validationErrors.value['district']!),
                            SizedBox(height: Spacing.space(4)),
                          ],
                          KeyedSubtree(
                            key: pincodeKey,
                            child: AppTextField(
                              label: 'Pincode',
                              placeholder: 'Enter pincode',
                              controller: pincodeController,
                              keyboardType: TextInputType.number,
                              // helperText: validationErrors.value['pincode'],
                              onChanged: (value) {
                                if (value.isNotEmpty) {
                                  final newErrors = Map<String, String>.from(
                                      validationErrors.value);
                                  newErrors.remove('pincode');
                                  validationErrors.value = newErrors;
                                }
                              },
                            ),
                          ),
                          if (validationErrors.value['pincode'] != null)
                            _buildErrorText(validationErrors.value['pincode']!),
                          SizedBox(height: Spacing.space(4)),
                          // Button to use current GPS location
                          if (isOnline.value)
                            OutlinedButton.icon(
                              onPressed: isFetchingLocation.value
                                  ? null
                                  : () => fetchCurrentLocation(),
                              icon: isFetchingLocation.value
                                  ? const SizedBox(
                                      width: 18,
                                      height: 18,
                                      child: CircularProgressIndicator(
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : Icon(
                                      Icons.my_location,
                                      size: 18,
                                      color: isUsingCurrentLocation.value
                                          ? Colors.white
                                          : AppColors.textStrong,
                                    ),
                              label: Text(
                                isFetchingLocation.value
                                    ? 'Fetching Current Location...'
                                    : 'Use My Current Location',
                                style: TextStyle(
                                  color: isUsingCurrentLocation.value
                                      ? Colors.white
                                      : AppColors.textStrong,
                                ),
                              ),
                              style: OutlinedButton.styleFrom(
                                backgroundColor: isUsingCurrentLocation.value
                                    ? AppColors.semanticsGreen20
                                    : Colors.transparent,
                                foregroundColor: isUsingCurrentLocation.value
                                    ? Colors.white
                                    : AppColors.textStrong,
                                side: BorderSide(
                                  color: isUsingCurrentLocation.value
                                      ? AppColors.semanticsGreen20
                                      : AppColors.strokeMedium,
                                ),
                                padding: const EdgeInsets.symmetric(
                                    horizontal: 16, vertical: 12),
                              ),
                            ),
                          SizedBox(height: Spacing.space(4)),
                          if (isOnline.value &&
                              currentMarkerLat.value != null &&
                              currentMarkerLng.value != null)
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
                              child: Stack(
                                children: [
                                  FlutterMap(
                                    mapController: mapController,
                                    options: MapOptions(
                                      initialCenter: LatLng(
                                          currentMarkerLat.value!,
                                          currentMarkerLng.value!),
                                      initialZoom: 14,
                                    ),
                                    children: [
                                      TileLayer(
                                        key: ValueKey(isSatelliteView.value),
                                        urlTemplate: isSatelliteView.value
                                            ? AppTileProvider.esriSatellite()
                                            : AppTileProvider.stadiaBright(),
                                        userAgentPackageName:
                                            'com.example.es_platform_mobile',
                                      ),
                                      DragMarkers(
                                        markers: [
                                          DragMarker(
                                            point: LatLng(
                                                currentMarkerLat.value!,
                                                currentMarkerLng.value!),
                                            size: const Size(40, 40),
                                            offset: const Offset(0, -20),
                                            builder:
                                                (context, latLng, isDragging) {
                                              return Icon(
                                                Icons.location_on,
                                                size: 40,
                                                color:
                                                    AppColors.semanticsGreen20,
                                              );
                                            },
                                            onDragEnd: (details, point) {
                                              currentMarkerLat.value =
                                                  point.latitude;
                                              currentMarkerLng.value =
                                                  point.longitude;
                                              latController.text =
                                                  point.latitude.toString();
                                              longController.text =
                                                  point.longitude.toString();
                                              isUsingCurrentLocation.value =
                                                  false;
                                            },
                                          ),
                                        ],
                                      ),
                                      RichAttributionWidget(
                                        attributions: [
                                          TextSourceAttribution(
                                            isSatelliteView.value
                                                ? 'Powered by Esri'
                                                : 'Stadia Maps | © OpenStreetMap contributors',
                                          ),
                                        ],
                                      ),
                                    ],
                                  ),
                                  Positioned(
                                    top: 10,
                                    right: 10,
                                    child: Material(
                                      color: Colors.white,
                                      elevation: 4,
                                      borderRadius: BorderRadius.circular(4),
                                      child: InkWell(
                                        onTap: () {
                                          isSatelliteView.value =
                                              !isSatelliteView.value;
                                        },
                                        child: Padding(
                                          padding: const EdgeInsets.all(8.0),
                                          child: Icon(
                                            isSatelliteView.value
                                                ? Icons.map
                                                : Icons.satellite_alt,
                                            size: 20,
                                            color: AppColors.textStrong,
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                  if (isFetchingLocation.value)
                                    Container(
                                      color: Colors.black.withOpacity(0.1),
                                      child: const Center(
                                        child: CircularProgressIndicator(),
                                      ),
                                    ),
                                ],
                              ),
                            ),
                          // ─── Editable Lat / Lng fields ───
                          Row(
                            children: [
                              Expanded(
                                child: AppTextField(
                                  label: 'Latitude',
                                  placeholder: 'e.g. 12.9716',
                                  controller: latController,
                                  keyboardType:
                                      const TextInputType.numberWithOptions(
                                          decimal: true, signed: true),
                                  onChanged: (val) {
                                    final v = double.tryParse(val);
                                    if (v != null) {
                                      currentMarkerLat.value = v;
                                      if (currentMarkerLng.value != null) {
                                        try {
                                          mapController.move(
                                              LatLng(
                                                  v, currentMarkerLng.value!),
                                              14);
                                        } catch (_) {}
                                      }
                                    }
                                  },
                                ),
                              ),
                              const SizedBox(width: 12),
                              Expanded(
                                child: AppTextField(
                                  label: 'Longitude',
                                  placeholder: 'e.g. 77.5946',
                                  controller: longController,
                                  keyboardType:
                                      const TextInputType.numberWithOptions(
                                          decimal: true, signed: true),
                                  onChanged: (val) {
                                    final v = double.tryParse(val);
                                    if (v != null) {
                                      currentMarkerLng.value = v;
                                      if (currentMarkerLat.value != null) {
                                        try {
                                          mapController.move(
                                              LatLng(
                                                  currentMarkerLat.value!, v),
                                              14);
                                        } catch (_) {}
                                      }
                                    }
                                  },
                                ),
                              ),
                            ],
                          ),
                          SizedBox(height: Spacing.space(4)),
                        ],
                      ),
                    ),

                    _buildCollectorsSection(context),
                    _buildContactDetailsSection(context),
                    _buildPhotosAndCommentsSection(),
                    _buildCollectionPlanSection(context),
                    // Submit Button
                    Container(
                      decoration: BoxDecoration(
                        color: Colors.white,
                        border: Border(
                          top: BorderSide(
                            color: Theme.of(context).colorScheme.outline,
                          ),
                          bottom: BorderSide(
                            color: Theme.of(context).colorScheme.outline,
                          ),
                        ),
                      ),
                      padding: Spacing.p(3),

                      // Create Site Button
                      child: AppButton(
                        width: double.infinity,
                        onPressed: isSaving.value ? null : onSavePressed,
                        child: isSaving.value
                            ? const SizedBox(
                                height: 20,
                                width: 20,
                                child: CircularProgressIndicator(
                                  strokeWidth: 2,
                                  valueColor: AlwaysStoppedAnimation<Color>(
                                      Colors.white),
                                ),
                              )
                            : const Text('Create Site'),
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

/// Normalizes geographic names by stripping common stop-words and extra spaces.
String _normalizeRegionName(String name) {
  return name
      .toLowerCase()
      .replaceAll(
          RegExp(
              r'\b(district|division|subdivision|county|state|taluk|tehsil|block)\b'),
          '')
      .replaceAll(RegExp(r'\s+'), ' ')
      .trim();
}

/// Robustly finds the best matching dropdown option for a given query.
CustomDropdownOption<String> _findBestRegionMatch(
  String query,
  List<CustomDropdownOption<String>> options,
) {
  if (query.isEmpty || options.isEmpty) {
    return CustomDropdownOption<String>(id: '', label: '');
  }

  final normalizedQuery = _normalizeRegionName(query);

  // Tier 1: Exact Normalized Match
  final exactMatch = options.firstWhere(
    (opt) => _normalizeRegionName(opt.label) == normalizedQuery,
    orElse: () => CustomDropdownOption<String>(id: '', label: ''),
  );
  if (exactMatch.id.isNotEmpty) return exactMatch;

  // Tier 2: Substring Match
  final substringMatches = options.where((opt) {
    final normalizedLabel = _normalizeRegionName(opt.label);
    return normalizedLabel.contains(normalizedQuery) ||
        normalizedQuery.contains(normalizedLabel);
  }).toList();

  if (substringMatches.isNotEmpty) {
    if (substringMatches.length == 1) return substringMatches.first;

    // Resolve ambiguity by picking the option with the closest length difference
    substringMatches.sort((a, b) {
      final diffA =
          (_normalizeRegionName(a.label).length - normalizedQuery.length).abs();
      final diffB =
          (_normalizeRegionName(b.label).length - normalizedQuery.length).abs();
      return diffA.compareTo(diffB);
    });
    return substringMatches.first;
  }

  return CustomDropdownOption<String>(id: '', label: '');
}
