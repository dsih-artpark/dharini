import 'package:flutter/material.dart';
import 'package:flutter_contacts/flutter_contacts.dart';
import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

class ContactListScreen extends StatefulWidget {
  const ContactListScreen({Key? key}) : super(key: key);

  @override
  _ContactListScreenState createState() => _ContactListScreenState();
}

class _ContactListScreenState extends State<ContactListScreen> {
  List<Contact> contacts = [];
  bool isLoading = true;
  String errorMessage = '';
  List<Map<String, String>> invitedContacts = [];
  final String storageKey = 'invited_contacts';

  @override
  void initState() {
    super.initState();
    _loadContacts();
    _loadInvitedContacts();
  }

  Future<void> _loadInvitedContacts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      final String? storedContacts = prefs.getString(storageKey);
      if (storedContacts != null) {
        final List<dynamic> decoded = jsonDecode(storedContacts);
        setState(() {
          invitedContacts = decoded.cast<Map<String, String>>();
        });
      }
    } catch (e) {
      print('Error loading saved contacts: $e');
    }
  }

  Future<void> _saveInvitedContacts() async {
    try {
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString(storageKey, jsonEncode(invitedContacts));
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Contacts saved successfully!')),
      );
    } catch (e) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Error saving contacts: $e')),
      );
    }
  }

  Future<void> _loadContacts() async {
    try {
      bool hasPermission =
          await FlutterContacts.requestPermission(readonly: true);
      print('Permission status: $hasPermission');

      if (!hasPermission) {
        hasPermission = await FlutterContacts.requestPermission();
        print('Second permission request status: $hasPermission');
      }

      if (hasPermission) {
        final fetchedContacts = await FlutterContacts.getContacts(
          withProperties: true,
          withPhoto: true,
        );
        print('Fetched ${fetchedContacts.length} contacts');

        if (mounted) {
          setState(() {
            contacts = fetchedContacts;
            isLoading = false;
            errorMessage = '';
          });
        }
      } else {
        if (mounted) {
          setState(() {
            isLoading = false;
            errorMessage =
                'Permission denied. Please grant contacts permission in settings.';
          });
        }
      }
    } catch (e) {
      print('Error loading contacts: $e');
      if (mounted) {
        setState(() {
          isLoading = false;
          errorMessage = 'Error loading contacts: $e';
        });
      }
    }
  }

  void _inviteContact(Contact contact) {
    final phoneNumber =
        contact.phones.isNotEmpty ? contact.phones.first.number : '';
    final newContact = {
      'name': contact.displayName,
      'phone': phoneNumber,
    };

    // Check if contact is already invited
    bool alreadyInvited =
        invitedContacts.any((invited) => invited['phone'] == phoneNumber);

    if (!alreadyInvited) {
      setState(() {
        invitedContacts.add(newContact);
      });
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${contact.displayName} invited!')),
      );
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('${contact.displayName} is already invited')),
      );
    }
  }

  void _showInvitedContacts() {
    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Invited Contacts'),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: invitedContacts
                .map((contact) => ListTile(
                      title: Text(contact['name'] ?? ''),
                      subtitle: Text(contact['phone'] ?? ''),
                      trailing: IconButton(
                        icon: const Icon(Icons.delete),
                        onPressed: () {
                          setState(() {
                            invitedContacts.removeWhere((invited) =>
                                invited['phone'] == contact['phone']);
                          });
                          Navigator.pop(context);
                          _showInvitedContacts();
                        },
                      ),
                    ))
                .toList(),
          ),
        ),
        actions: [
          TextButton(
            onPressed: () {
              Navigator.pop(context);
            },
            child: const Text('Close'),
          ),
          ElevatedButton(
            onPressed: _saveInvitedContacts,
            child: const Text('Save'),
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Contact List'),
        actions: [
          // Show invited contacts
          IconButton(
            icon: const Icon(Icons.people),
            onPressed: _showInvitedContacts,
          ),
          // Refresh contacts
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: () {
              setState(() {
                isLoading = true;
                errorMessage = '';
              });
              _loadContacts();
            },
          ),
        ],
      ),
      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : errorMessage.isNotEmpty
              ? Center(
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        errorMessage,
                        textAlign: TextAlign.center,
                        style: const TextStyle(color: Colors.red),
                      ),
                      const SizedBox(height: 20),
                      ElevatedButton(
                        onPressed: () {
                          setState(() {
                            isLoading = true;
                            errorMessage = '';
                          });
                          _loadContacts();
                        },
                        child: const Text('Retry'),
                      ),
                    ],
                  ),
                )
              : contacts.isEmpty
                  ? const Center(child: Text('No contacts found'))
                  : ListView.builder(
                      itemCount: contacts.length,
                      itemBuilder: (context, index) {
                        final contact = contacts[index];
                        final phoneNumber = contact.phones.isNotEmpty
                            ? contact.phones.first.number
                            : 'No phone number';
                        final isInvited = invitedContacts
                            .any((invited) => invited['phone'] == phoneNumber);

                        return ListTile(
                          leading: contact.photo != null
                              ? CircleAvatar(
                                  backgroundImage: MemoryImage(contact.photo!))
                              : CircleAvatar(
                                  child: Text(contact.displayName[0])),
                          title: Text(contact.displayName),
                          subtitle: Text(phoneNumber),
                          trailing: ElevatedButton(
                            onPressed: isInvited
                                ? null
                                : () => _inviteContact(contact),
                            child: Text(isInvited ? 'Invited' : 'Invite'),
                          ),
                        );
                      },
                    ),
    );
  }
}
