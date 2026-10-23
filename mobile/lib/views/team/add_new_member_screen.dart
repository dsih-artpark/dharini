import 'package:built_collection/built_collection.dart';
import 'package:design_system/design_system.dart';
import 'package:es_client/es_client.dart';
import 'package:es_platform_mobile/hooks/auth.dart';
import 'package:es_platform_mobile/utils/tenant_roles.dart';
import 'package:flutter/material.dart';
import 'package:flutter_contacts/flutter_contacts.dart';
import 'package:flutter_hooks/flutter_hooks.dart';
import 'package:fquery/fquery.dart';

// Updated SelectedContact to handle potential nulls from picker
class SelectedContact {
  final String id;
  final String initials;
  final String name;
  final String phone;
  String? selectedRoleId; // Add field to store selected role ID

  SelectedContact({
    required this.id,
    required this.initials,
    required this.name,
    required this.phone,
    this.selectedRoleId,
  });

  // Helper to create initials from name
  static String _getInitials(String name) {
    if (name.isEmpty) return '??';
    List<String> words =
        name.trim().split(' ').where((s) => s.isNotEmpty).toList();
    if (words.isEmpty) return '??';
    if (words.length == 1) {
      return words[0]
          .substring(0, (words[0].length >= 2) ? 2 : words[0].length)
          .toUpperCase();
    }
    return (words[0].substring(0, 1) + words.last.substring(0, 1))
        .toUpperCase();
  }

  // Factory constructor to create from FlutterContacts Contact
  factory SelectedContact.fromContact(Contact contact) {
    return SelectedContact(
      id: contact.id,
      initials: _getInitials(contact.displayName),
      name: contact.displayName,
      phone: contact.phones.isNotEmpty
          ? (contact.phones.first.number)
          : 'No Phone',
      selectedRoleId: null, // Initialize roleId as null
    );
  }

  // Override equality operator and hashCode for proper comparison
  @override
  bool operator ==(Object other) =>
      identical(this, other) ||
      other is SelectedContact &&
          runtimeType == other.runtimeType &&
          id == other.id; // Compare based on ID

  @override
  int get hashCode => id.hashCode;

  // Add copyWith method for easier state updates
  SelectedContact copyWith({String? selectedRoleId}) {
    return SelectedContact(
      id: id,
      initials: initials,
      name: name,
      phone: phone,
      selectedRoleId: selectedRoleId ?? this.selectedRoleId,
    );
  }
}

class AddNewMemberScreen extends HookWidget {
  const AddNewMemberScreen({super.key, required}); // Update constructor

  @override
  Widget build(BuildContext context) {
    final teamRoles = useTeamRoles();
    final profile = useProfile();
    final queryClient = useQueryClient();

    // --- Get IDs needed for mutation OUTSIDE the callback ---
    final String? projectId = useCurrentProjectId();
    final String? teamId = teamIdForProject(profile.data, projectId);
    // -----------------------------------------------------

    // --- Debug Print for Team Roles ---
    print('Team Roles Status:');
    print('  - isLoading: ${teamRoles.isLoading}');
    print('  - isError: ${teamRoles.error != null}');
    print('  - error: ${teamRoles.error}');
    print('  - data: ${teamRoles.data}');
    print('  - data is empty: ${teamRoles.data?.isEmpty}');
    print('--------------------------------');

    final selectedContacts =
        useState<List<SelectedContact>>([]); // Start with empty list
    final isPickingContacts = useState(false); // Loading state for picker

    // --- Add Member Mutation Hook ---
    final addMembersMutation = useAddNewTeamMembers(
      teamId, // Use the captured teamId
      onSuccess: (response) {
        if (context.mounted) {
          queryClient.invalidateQueries(QueryKeys.teamMembersFieldView(teamId));
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(
              content: Text('Members added successfully!'),
              backgroundColor: Colors.green,
            ),
          );
          // Optionally clear selected contacts or navigate back
          selectedContacts.value = []; // Clear list on success
          // Navigator.pop(context); // Or navigate back
        }
      },
      onError: (errorMessage) {
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(
              content: Text('Failed to add members: $errorMessage'),
              backgroundColor: Colors.red,
            ),
          );
        }
      },
    );
    // --------------------------------

    // Function to remove a contact
    void removeContact(String id) {
      selectedContacts.value = selectedContacts.value
          .map((c) {
            if (c.id == id) {
              return c.copyWith(
                  selectedRoleId:
                      null); // Clear role on removal? Or just remove.
            }
            return c;
          })
          .where((c) => c.id != id)
          .toList();
    }

    // --- Refactored Multi-Contact Picker Logic (No Hooks Inside) ---
    Future<List<Contact>> _showMultiContactPicker(BuildContext context) async {
      List<Contact> allContacts = [];
      Set<String> selectedInDialogIds = {};
      bool isLoading = true;
      String? error;

      // Function to fetch contacts - defined outside the dialog builder
      Future<void> fetchContacts() async {
        try {
          if (await FlutterContacts.requestPermission(readonly: true)) {
            // Fetch contacts with properties needed (like phone)
            allContacts =
                await FlutterContacts.getContacts(withProperties: true);
            isLoading = false;
          } else {
            error = 'Contact permission denied.';
            isLoading = false;
          }
        } catch (e) {
          print("Error fetching contacts: $e");
          error = 'Failed to fetch contacts.';
          isLoading = false;
        }
      }

      // Pre-fetch contacts before showing the dialog
      await fetchContacts();

      // Use showDialog with StatefulBuilder for internal dialog state
      return await showDialog<List<Contact>>(
            context: context,
            builder: (dialogContext) {
              return StatefulBuilder(
                builder: (stfContext, stfSetState) {
                  // This builder runs when stfSetState is called

                  return AlertDialog(
                    title: Text("Select Contacts"),
                    content: Container(
                      width: double.maxFinite,
                      child: isLoading
                          ? Center(child: CircularProgressIndicator())
                          : error != null
                              ? Center(child: Text(error!))
                              : allContacts.isEmpty
                                  ? Center(child: Text("No contacts found."))
                                  : ListView.builder(
                                      shrinkWrap: true,
                                      itemCount: allContacts.length,
                                      itemBuilder: (listContext, index) {
                                        final contact = allContacts[index];
                                        final isSelected = selectedInDialogIds
                                            .contains(contact.id);
                                        return CheckboxListTile(
                                          title: Text(contact.displayName),
                                          subtitle: Text(
                                              contact.phones.isNotEmpty
                                                  ? contact.phones.first.number
                                                  : 'No phone'),
                                          value: isSelected,
                                          onChanged: (bool? value) {
                                            // Use stfSetState to update the dialog's UI
                                            stfSetState(() {
                                              if (value == true) {
                                                selectedInDialogIds
                                                    .add(contact.id);
                                              } else {
                                                selectedInDialogIds
                                                    .remove(contact.id);
                                              }
                                            });
                                          },
                                        );
                                      },
                                    ),
                    ),
                    actions: <Widget>[
                      TextButton(
                        child: Text("Cancel"),
                        onPressed: () => Navigator.of(dialogContext).pop([]),
                      ),
                      TextButton(
                        child: Text("Confirm"),
                        onPressed: () {
                          // Filter the originally fetched contacts based on the selected IDs
                          final selected = allContacts
                              .where((c) => selectedInDialogIds.contains(c.id))
                              .toList();
                          Navigator.of(dialogContext).pop(selected);
                        },
                      ),
                    ],
                  );
                },
              );
            },
          ) ??
          []; // Return empty list if dialog is dismissed
    }

    // Updated function to handle contact selection
    Future<void> inviteViaContacts() async {
      if (isPickingContacts.value) return;
      isPickingContacts.value = true;

      try {
        // Show the custom multi-picker dialog
        final List<Contact> pickedContacts =
            await _showMultiContactPicker(context);

        if (pickedContacts.isNotEmpty) {
          // --- Get the default role ID ---
          String? defaultRoleId;
          if (teamRoles.data != null && teamRoles.data!.isNotEmpty) {
            defaultRoleId = teamRoles.data!.first.id;
          }
          // ------------------------------

          // Convert to SelectedContact, assigning default role
          final newSelections = pickedContacts
              .map((contact) => SelectedContact.fromContact(contact).copyWith(
                  selectedRoleId: defaultRoleId)) // Assign default role here
              .toList();

          // Get current IDs to avoid duplicates
          final currentIds = selectedContacts.value.map((c) => c.id).toSet();

          // Filter out contacts that are already selected
          final uniqueNewSelections = newSelections
              .where((newContact) => !currentIds.contains(newContact.id))
              .toList();

          // Add the unique new contacts to the list
          if (uniqueNewSelections.isNotEmpty) {
            selectedContacts.value = [
              ...selectedContacts.value,
              ...uniqueNewSelections
            ];
          }

          // Optionally notify user about duplicates skipped
          final duplicateCount =
              newSelections.length - uniqueNewSelections.length;
          if (duplicateCount > 0 && context.mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                  content: Text(
                      "$duplicateCount contact(s) were already selected.")),
            );
          }
        }
      } catch (e) {
        print("Error picking contacts: $e");
        if (context.mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            SnackBar(content: Text('Failed to pick contacts: $e')),
          );
        }
      } finally {
        isPickingContacts.value = false;
      }
    }

    // Function to handle adding members
    void addMembers() {
      print("--- Add Members button clicked ---"); // Debug Start

      // 1. Use the IDs captured in the build scope
      print("Project ID (captured): $projectId"); // Debug projectId
      print("Team ID (captured): $teamId"); // Debug teamId

      if (projectId == null) {
        print("Validation Failed: Project ID is null"); // Debug Fail
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not find project information.')),
        );
        return;
      }

      if (teamId == null) {
        print("Validation Failed: Team ID is null"); // Debug Fail
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Could not find team information.')),
        );
        return;
      }

      // 2. Validate: Check if all selected contacts have a role
      final contactsWithoutRole = selectedContacts.value
          .where((c) => c.selectedRoleId == null)
          .toList();
      print(
          "Contacts without role: ${contactsWithoutRole.length}"); // Debug validation

      if (contactsWithoutRole.isNotEmpty) {
        print(
            "Validation Failed: Some contacts have no role selected"); // Debug Fail
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Please select a role for all contacts.')),
        );
        return;
      }

      // 3. Prepare DTO
      final membersToCreate = selectedContacts.value.map((contact) {
        // Split name into first and last (basic split)
        String? firstName;
        String? lastName;
        final nameParts = contact.name.trim().split(' ');
        if (nameParts.isNotEmpty) {
          firstName = nameParts.first;
          if (nameParts.length > 1) {
            lastName = nameParts.sublist(1).join(' ');
          }
        }

        return MemberDto((b) => b
          ..contactNumber = contact.phone
          ..firstName = firstName
          ..lastName = lastName);
      }).toList();

      print("Members DTO prepared: ${membersToCreate}"); // Debug DTO list

      if (membersToCreate.isEmpty) {
        print(
            "Validation Failed: Member list to create is empty"); // Debug Fail
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('No members selected to add.')),
        );
        return;
      }

      final createDto = CreateMembersListDto((b) => b
        ..project = projectId // Add project ID
        ..teamId = teamId // Team the members are added to
        ..members = ListBuilder(membersToCreate));

      // 4. Call Mutation
      print("Calling mutation with DTO: ${createDto}"); // Debug Call
      addMembersMutation.mutate(createDto);
      print("--- Mutation called ---"); // Debug End
    }

    return Scaffold(
      backgroundColor:
          AppColors.background, // Background color from screenshot context
      appBar: AppBar(
        backgroundColor: AppColors.white, // White AppBar
        elevation: 0, // No shadow
        leading: IconButton(
          icon: const Icon(Icons.arrow_back, color: AppColors.textStrong),
          onPressed: () => Navigator.pop(context),
        ),
        title: Text(
          'Add New Member',
          style: AppTypography.textTheme.bodyB1SemiBold
              .copyWith(color: AppColors.textStrong),
        ),
        centerTitle: false, // Title not centered in screenshot
      ),
      body: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Padding(
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  'Add Members',
                  // Use a slightly larger, bolder style if available, otherwise fallback
                  style: AppTypography.textTheme.headingH2
                      .copyWith(color: AppColors.textStrong),
                ),
                const SizedBox(height: 8),
                const Divider(
                    color: AppColors.strokeWeak), // Divider below title
                const SizedBox(height: 16),
                Text(
                  'We will send an invite via SMS to the selected contacts, once you submit.',
                  style: AppTypography.textTheme.bodyB3Regular
                      .copyWith(color: AppColors.textWeak), // Fallback color
                ),
                const SizedBox(height: 24),
                // Invite via Contacts Button with Loading Indicator
                SizedBox(
                  width: double.infinity,
                  height: 48, // Give button a standard height
                  child: AppButton(
                    isLoading: isPickingContacts.value,
                    onPressed: inviteViaContacts,
                    child: const Text('Invite via Contacts'),
                  ),
                ),
              ],
            ),
          ),

          // Selected Contacts Section
          Padding(
            padding:
                const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
            child: Text(
              'Selected Contacts (${selectedContacts.value.length})',
              style: AppTypography.textTheme.bodyB2SemiBold
                  .copyWith(color: AppColors.textStrong),
            ),
          ),

          // List of Selected Contacts
          Expanded(
            child: Container(
              color: AppColors.white, // White background for the list area
              child: ListView.separated(
                itemCount: selectedContacts.value.length,
                separatorBuilder: (context, index) => const Divider(
                    height: 1,
                    color: AppColors.strokeWeak,
                    indent: 16,
                    endIndent: 16),
                itemBuilder: (context, index) {
                  final contact = selectedContacts.value[index];
                  return ListTile(
                    leading: CircleAvatar(
                      backgroundColor: AppColors.background, // Fallback color
                      child: Text(
                        contact.initials,
                        style: AppTypography.textTheme.bodyB3SemiBold
                            .copyWith(color: AppColors.textWeak),
                      ),
                    ),
                    title: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          contact.name,
                          style: AppTypography.textTheme.bodyB2Regular
                              .copyWith(color: AppColors.textStrong),
                        ),
                        const SizedBox(height: 4),
                        // Role Dropdown
                        if (teamRoles.data != null &&
                            teamRoles.data!.isNotEmpty)
                          DropdownButton<String>(
                            value: contact.selectedRoleId,
                            hint: Text("Select Role",
                                style: AppTypography.textTheme.bodyB4Regular
                                    .copyWith(color: AppColors.textWeak)),
                            isDense: true,
                            isExpanded:
                                true, // Make dropdown take available width
                            underline: Container(
                                height: 1,
                                color:
                                    AppColors.strokeWeak), // Simple underline
                            items: teamRoles.data!
                                .map((role) => DropdownMenuItem<String>(
                                      value: role.id, // Use role ID as value
                                      child: Text(role.name,
                                          style: AppTypography
                                              .textTheme.bodyB3Regular
                                              .copyWith(
                                                  color: AppColors.textStrong)),
                                    ))
                                .toList(),
                            onChanged: (String? newRoleId) {
                              if (newRoleId != null) {
                                // Update the specific contact's roleId immutably
                                selectedContacts.value =
                                    selectedContacts.value.map((c) {
                                  if (c.id == contact.id) {
                                    return c.copyWith(
                                        selectedRoleId: newRoleId);
                                  }
                                  return c;
                                }).toList();
                              }
                            },
                          )
                        else if (teamRoles.isLoading)
                          Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text("Loading roles...",
                                style: AppTypography.textTheme.bodyB4Regular
                                    .copyWith(color: AppColors.textWeak)),
                          )
                        else if (teamRoles.error != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text("Error loading roles",
                                style: AppTypography.textTheme.bodyB4Regular
                                    .copyWith(color: AppColors.semanticsRed30)),
                          )
                        else
                          Padding(
                            padding: const EdgeInsets.only(top: 4.0),
                            child: Text("No roles available",
                                style: AppTypography.textTheme.bodyB4Regular
                                    .copyWith(color: AppColors.textWeak)),
                          )
                      ],
                    ),
                    subtitle: Text(
                      contact.phone,
                      style: AppTypography.textTheme.bodyB4Regular.copyWith(
                          color: AppColors.textWeak), // Fallback color
                    ),
                    trailing: IconButton(
                      icon: const Icon(Icons.delete_outline,
                          color: AppColors.semanticsRed30),
                      onPressed: () => removeContact(contact.id),
                      splashRadius: 20,
                      constraints: const BoxConstraints(),
                    ),
                  );
                },
              ),
            ),
          ),
        ],
      ),
      // Bottom Action Button
      bottomNavigationBar: Padding(
        padding: EdgeInsets.only(
            left: 16.0,
            right: 16.0,
            bottom: MediaQuery.of(context).padding.bottom +
                16.0, // Adjust for safe area
            top: 16.0),
        child: AppButton(
          // Disable button if no contacts or if mutation is pending
          onPressed:
              selectedContacts.value.isEmpty || addMembersMutation.isPending
                  ? null
                  : addMembers,
          isLoading: addMembersMutation.isPending, // Show loading indicator
          child: const Text('Add Members'),
        ),
      ),
    );
  }
}
