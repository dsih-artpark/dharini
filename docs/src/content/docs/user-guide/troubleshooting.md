---
title: Troubleshooting Guide
description: Common issues and solutions for Dharini platform users
---

This guide covers common issues users may encounter while using the Dharini platform and provides step-by-step solutions.

## Logging In (Mobile App and Web Portal)

Dharini uses a one-time password (OTP) sent to your email address or phone number. There are no passwords to reset.

### Issue: Not Receiving the OTP

**Problem:** After you enter your email address or phone number and ask for a code, nothing arrives.

**Solutions:**

1. **Check you chose the right method**
   - On the login screen, make sure **Email** or **Phone** is selected to match what you entered
   - Your phone number must be 10 digits (with or without +91)

2. **Check the address or number**
   - Look for typos
   - Your email address or phone number must already be registered. If it is not, no code is sent. Ask your admin to check that your account exists and that it uses the same email or number.

3. **Check your inbox or SMS**
   - Email codes can land in the spam or junk folder
   - SMS codes can be delayed by a few minutes where the network is weak

4. **Resend the code**
   - Tap or select **Resend OTP**. On the web, wait for the "Resend in …s" countdown to finish first.
   - Use only the newest code. Older codes stop working.

5. **Try the other method**
   - If your admin has registered both an email address and a phone number for you, try the other one

### Issue: OTP Expired or Not Accepted

**Problem:** You get "OTP expired" or the code is rejected.

**Solutions:**

1. A code is valid for **3 minutes**. Request a new one with **Resend OTP** and enter it quickly.
2. Use the code from the **latest** message.
3. After several wrong codes in a row (5 within 15 minutes), Dharini stops accepting codes and shows "Too many incorrect OTP attempts. Please request a new code." Request a new code with **Resend OTP** and enter it carefully.
4. If you typed the wrong email address or number, use **Change email**, **Change number** (mobile) or **Try different Email** or **Try different Phone Number** (web) to go back.

### Issue: Logged Out Unexpectedly

**Problem:** You are sent back to the login screen.

**Solutions:**

1. Your login lasts about 7 days. After that, log in again with a new OTP.
2. If you are logged out sooner, log in again with a new OTP. If it keeps happening, tell your admin.
3. On the mobile app, visits that were not uploaded yet stay on your phone. They upload after you log back in and the network is available.

### Issue: Cannot Log In Even With the Right OTP

**Problem:** The code is accepted but you cannot get in, or you land on an empty screen.

**Solutions:**

1. **Mobile app:** If you see "You're not assigned to a project yet. Contact your administrator.", your admin must add you to a project and team.
2. **Web portal:** If the **Select a workspace** list is empty, you are not a member of any workspace. Ask your admin to invite you.
3. Check with your admin that your role has been assigned.

## Mobile App Issues (Field Collectors)

### Choosing or Changing a Project

#### Issue: "Couldn't load your projects"

**Problem:** The **Select a project** screen shows "Couldn't load your projects. Check your connection and try again."

**Solutions:**

1. Check that your phone has WiFi or mobile data
2. Tap **Retry**

#### Issue: Visits or Sites Are Missing

**Problem:** You cannot see the visits or sites you expect.

**Solutions:**

1. Check you are in the right project. Go to **Profile**, then **Switch Project**.
2. Pull down on the Home screen to refresh.
3. Make sure you opened the app online at least once after your admin assigned the visits, so the app could download them.
4. Ask your admin to check that the site has a collection plan with you as a collector.

#### Issue: No Add Visit Button or Team Tab

**Problem:** You cannot see **Add Visit** on the Home screen, or you do not see the **Team** tab.

**Solutions:**

- The **Add Visit** button only appears if your role is allowed to create visits
- The **Team** tab is only for Collector Admins
- Ask your admin to check your role

### Connectivity and Syncing

#### Issue: Low or No Network Connectivity

**Problem:** You are in an area with poor or no mobile network coverage.

**Solutions:**

1. **Carry on working.** The app is built to work offline. A banner at the top says **You are working offline. Changes will sync when online.**
2. **Your work is saved on your phone.** Sites, visits, barcodes and photos are kept locally.
3. **Sync when you are back in coverage.** The app uploads pending visits by itself when the network returns and every few minutes after that.

:::tip
You can also tap the **sync icon** at the top of the Home screen to upload straight away. The icon only appears while visits are waiting. The number on it shows how many.
:::

#### Issue: Visits Are Not Uploading

**Problem:** You have a network but the sync icon still shows a number, or the app shows a sync message.

**Solutions:**

1. **Read the message.**
   - "Some visits are pending server sync. Will retry automatically." – This is normal. The app uploads a new site first, then the visits at that site. Wait a few minutes.
   - "Sync failed. Please try again." – Tap the sync icon.
2. **Check your connection.** Open a web page or another app to check that your internet really works. Try switching between WiFi and mobile data.
3. **Tap the sync icon** at the top of the Home screen and wait for the **Syncing pending visits...** bar to finish.
4. **Check the Visits tab.** Under **Pending**, **Offline Pending Visits** lists visits that are still on your phone.
5. **Close and reopen the app,** then try again.
6. **Check storage.** Make sure your phone has free space.
7. **Update the app.** An old version may not be able to upload to the server.

:::caution
Do not uninstall the app or clear its data while visits are waiting to upload. This will lose that data.
:::

#### Issue: Logging Out With Pending Visits

When you tap **Logout**, the app first tries for a short time to upload any pending visits. Anything that cannot be uploaded stays safely on your phone and uploads later. Even so, try to sync first and wait for the sync icon to disappear before you log out.

### Starting a Visit and Creating Sites

#### Issue: "Location permission is required to find nearby sites"

**Solutions:**

1. Go to your phone's **Settings**, then **Apps**, then **Dharini**, then **Permissions**, and allow **Location**
2. Turn on **Location** or **GPS** on your phone
3. Reopen **Add Visit**. You can also search for the site by name instead.

#### Issue: Cannot Create a Site ("Please fill all the required fields")

**Solutions:**

1. Scroll through the form. A message appears under each field that is missing, such as "Site name is required" or "Pincode is required".
2. Check that the phone number has 10 digits.
3. Choose at least one disease and at least one collector.
4. Set the location by tapping **Use My Current Location** or typing the **Latitude** and **Longitude**. "Location is required" means no location is set.
5. If you see "Could not create site online. Saving offline...", the site is saved on your phone and will upload later.

#### Issue: "Resume Visit Draft?"

**Problem:** The app asks whether to resume a draft when you open a visit.

**Solutions:**

- Tap **Resume** to go on where you stopped
- Tap **Start Fresh** to discard the draft and begin again

### GPS and Location

#### Issue: GPS Not Working or Inaccurate

**Problem:** The app cannot get your location or shows a wrong position.

**Solutions:**

1. **Turn on Location services** in your phone's settings and choose the high-accuracy mode if there is one
2. **Allow the app** to use location: **Settings**, then **Apps**, then **Dharini**, then **Permissions**
3. **Move to an open area** with a clear view of the sky and wait 30 to 60 seconds
4. **Restart your phone** if location still does not work
5. **Test another app** such as a maps app. If it also fails, the phone may have a hardware problem.

### Camera and Photos

#### Issue: Cannot Take Photos

**Solutions:**

1. Allow **Camera** under **Settings**, then **Apps**, then **Dharini**, then **Permissions**
2. Close any other app that uses the camera
3. Restart the Dharini app
4. Check that your phone has free storage

### Scanning Barcodes

#### Issue: The Camera Does Not Start

**Problem:** The scanner says it needs camera access, or the camera did not start.

**Solutions:**

1. Allow **Camera** access for Dharini in your phone's **Settings**
2. Tap **Try again**
3. If it still does not work, tap **Enter manually** and type the barcode

#### Issue: Barcode Won't Scan

**Problem:** The scanner does not read the code on the container.

**Solutions:**

1. **Improve the light.** Avoid shadows, or tap the flashlight icon in the scanner.
2. **Clean the label.** Wipe off dirt or water. If the label is torn or faded, it may not scan.
3. **Hold steady**, not too close to the label, and let the camera focus.
4. **Type it instead.** Tap **Enter manually**, type the code, and tap **Check barcode**.

#### Issue: A Barcode Is Refused

**Problem:** The scanner shows a message instead of letting you use the barcode.

| Message | What it means | What to do |
| --- | --- | --- |
| "… was already scanned in this session." | You already scanned this barcode in this visit | Scan the next container instead |
| "… is already assigned to another sample." | The barcode is used by another sample | Check you have the right container. If the label is wrong, use a different container. |
| "All … samples already have a barcode." | You have scanned enough for this sample type | Tap **Done** |
| "Could not check this barcode against the project. Check your connection and try again." | The server could not be reached to check the code | Check your connection and scan again |

Tap **Scan another** to try again. If you believe the barcode is correct and the message is wrong, tell your admin.

:::note
When your phone is offline, the scanner can only check barcodes against what is on the phone. The server checks all barcodes again when the visit syncs, so a duplicate can still be found at that point. If you see a duplicate message after syncing, tell your admin.
:::

#### Issue: Bulk Generate Gives the Wrong Numbers

**Problem:** After tapping **Generate** the barcodes do not match your labels.

**Solutions:**

1. Check the starting barcode you typed. The app counts up from the **last number** in it (for example, BMM001 becomes BMM002, BMM003).
2. Edit any barcode by hand in its **Barcode** box.
3. Or switch to **Continuous Scan** to scan each label.

### Submitting a Visit

#### Issue: Cannot Submit a Visit

**Solutions:**

1. If the app says you are not assigned to a team, ask your admin to add you to a team
2. If the screen says "Missing required data", go back and finish the steps you skipped
3. Make sure each sample has a barcode, and check that the location was captured (wait for **Fetching Location...** to finish)
4. If the app says "Visit saved locally. Will sync when online.", your visit is safe. It uploads when the network returns.

#### Issue: "Sync failed. Will retry when online."

**Problem:** This message appears on the success screen after you submit a visit.

**Solutions:**

- Nothing is lost. The visit is stored on your phone.
- Connect to the network and tap the sync icon on the Home screen.

### Battery and Device Issues

#### Issue: Battery Drains Quickly

**Solutions:**

1. Lower the screen brightness and close other apps
2. GPS and the camera use a lot of power. Finish visits promptly.
3. Carry a power bank on long field days

#### Issue: App Crashes or Freezes

**Solutions:**

1. Close the app completely and reopen it
2. Free up memory and storage on your phone
3. Update the app from [https://in.dharini.artpark.ai/download/](https://in.dharini.artpark.ai/download/)
4. Clear the app's cache in **Settings**, then **Apps**, then **Dharini**, then **Storage** (do not clear data)
5. Reinstall only as a last resort, and only when no visits are waiting to upload

:::danger
**Never uninstall the app or clear its data if visits are waiting to upload.** This will permanently lose that data.
:::

## Web Portal Issues (Admins and Lab Technicians)

### Login and Access

#### Issue: Cannot Log In to the Web Portal

**Problem:** You cannot get into [https://in.dharini.artpark.ai/](https://in.dharini.artpark.ai/)

**Solutions:**

1. Follow the steps in [Logging In](#logging-in-mobile-app-and-web-portal) above
2. Try a different browser (Chrome, Firefox or Edge)
3. Clear the browser's cache and cookies, or open a private window
4. Turn off browser extensions that block scripts or cookies
5. Check with your admin that your account is active and has a role

#### Issue: Blank Dashboards or Wrong Workspace

**Problem:** Pages are empty, or you see data that belongs to a different workspace.

**Solutions:**

1. Look at the workspace name at the top of the left-hand menu. Select it and choose the right workspace.
2. If your workspace is missing from the list, you may have been removed from it. Ask a workspace admin.
3. Refresh the page after switching workspace.

#### Issue: "Invalid Token" on an Invitation Link

**Problem:** An invitation link says the token has expired or is invalid.

**Solutions:**

1. Invitation links can expire. Ask the person who invited you to send a new invitation.
2. If you already accepted the invite, go to the login page and log in normally.

#### Issue: A Menu Item or Button Is Missing

**Solutions:**

- Buttons and menu items depend on your role. For example, **Lab Processing** only appears for lab roles, **Create a Project** is for Workspace Admins, and **Settings** tabs differ for workspace admins and super admins.
- Ask your admin to check your role.

### Sample Management (Lab)

#### Issue: Sample Not Appearing in the Lab List

**Problem:** A sample collected in the field does not show up on the lab screen.

**Solutions:**

1. **Check the tab.** Samples appear in the tab for their stage. New samples are in **Collected**.
2. **Check the workspace and project** you are working in.
3. **Check the filters.** Select **Clear all filters** and widen the **Date Range**.
4. **Ask the collector to sync.** The sample only appears once the collector's phone has uploaded the visit. They can check that the sync icon on their Home screen has disappeared.
5. **Refresh the page** and wait a few minutes.

#### Issue: Cannot Save a Step

**Problem:** **Save & Exit** or **Proceed** is greyed out.

**Solutions:**

- **Receiving:** Every sample needs a decision (**Accept** or **Reject**). If you accept any sample, the receiving date, receiving time and **Received By** are required. A rejected sample needs a reason.
- **Pre-processing (pooling):** Every pool needs at least two samples of the same type. Remove or complete any pool that has only one.
- **Extraction:** **Performed By**, **Nucleic Acid Extracted** and the **Extraction Method/Kit** are required. Dharini shows a message naming what is missing.
- **Testing:** Choose a kit or protocol and enter a result for each sample.

#### Issue: Accession or Process Button Is Greyed Out

**Problem:** The buttons on the rows cannot be selected.

**Solutions:**

- This happens while samples are ticked for **Process Selected**. Select **Clear selection** to use the row buttons again.

#### Issue: Cannot Scan or Find a Sample

**Problem:** You cannot find the sample for a container.

**Solutions:**

1. Type the barcode in the **Sample Barcode** filter. Select **Filter** to open it.
2. Remove other filters that might hide the sample.
3. Check the other tabs. The sample may be at a later stage.

### Reports and Uploads

#### Issue: Cannot Upload a File

**Problem:** A test report, image or batch document fails to upload.

**Solutions:**

1. Check the file type and size. Test report files can be up to 25 MB. Profile pictures must be under 5 MB.
2. Compress large files.
3. Check your connection and try again.
4. Use a different browser or clear the browser's cache.

### Data Import

#### Issue: Upload Rejected

**Problem:** Dharini says "Upload rejected" or "nothing was imported".

**Solutions:**

1. Use only an **.xlsx** file made from the template. Download it again with **Download template (.xlsx)** if needed.
2. Check you chose the correct **Disease** group (**FMD / LSD** or **Avian Influenza (AI)**) and the correct tab (**Collection Data** or **Lab Data**).
3. Read the list of issues. Each one gives the row, the column and the problem. Fix them in the file and upload it again. Nothing is imported until the whole file is valid.
4. For **Lab Data**, make sure the matching **Collection Data** has already been imported.

### Sequencing

#### Issue: Sequencing Upload or Run Fails

**Solutions:**

1. Wait until the reads file shows **Uploaded**. If it fails, tap **Retry** next to the file.
2. Choose a processing pipeline before continuing. If none are listed, no pipelines are available right now. Tell your admin.
3. For an NCBI accession, check the accession number. "GenBank ID not found" means it is not valid.
4. Open the record to see where the run stopped, then re-submit the file. If the same failure repeats, contact support.

### Data Playground and Exports

#### Issue: Data Playground Will Not Run

**Solutions:**

1. Tick at least one project. The message "Select at least one project." means none is ticked.
2. If it fails, try again with fewer projects.
3. Use **Run & Download CSV** for large exports.

#### Issue: "You do not have permission to read visits"

**Solution:** Your role cannot see this data. Ask your admin to change your role.

## General Issues

### Slow Performance

**For the mobile app:**

1. Free up storage on your phone
2. Close other apps
3. Restart your phone
4. Update to the latest version

**For the web portal:**

1. Clear your browser's cache and cookies
2. Close extra tabs
3. Check your internet speed
4. Try a different browser

### Data Does Not Match Between the App and the Portal

**Solutions:**

1. On the phone, check that the sync icon has gone, so there is nothing waiting to upload
2. Reload the web page. Check you are in the same workspace and project.
3. Wait a few minutes
4. If it still differs, tell your admin

## When to Contact Support

Contact your administrator or technical support if:

- The problem continues after you try the steps above
- You see an error that this guide does not cover
- Data appears lost or wrong
- You cannot get access to your account
- You think there is a security problem

**Information to give:**

- Your name and role
- Your phone model and Android version (for mobile problems), or your browser and version (for web problems)
- What you were doing and the exact message you saw
- What you have already tried
- A screenshot, if you can

## Support Best Practices

### Preventive Measures

- Keep the app updated
- Keep location and camera permissions turned on
- Sync at the end of each field day
- Keep enough storage and battery on your phone
- Use an up-to-date browser for the web portal

### Data Safety

- Wait for the sync icon to disappear before you log out
- Do not uninstall the app while visits are waiting to upload
- Download your data before any purge or large change
- Report data problems right away

---

## Additional Resources

- [User Guide Overview](/user-guide/)
- [Project Admin Guide](/user-guide/project-admin)
- [Field Collector Guide](/user-guide/field-collector)
- [Lab Technician Guide](/user-guide/lab-technician)
- [Administrator Guide](/administrator-guide/) (for technical administrators)

If your issue is not resolved using this guide, please contact your project administrator for assistance.
