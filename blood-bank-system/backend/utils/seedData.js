const User = require('../models/User');
const BloodStock = require('../models/BloodStock');
const BloodRequest = require('../models/BloodRequest');
const Donation = require('../models/Donation');
const Camp = require('../models/Camp');

const autoSeedIfEmpty = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[Database] Existing records found, skipping auto-seed.');
      return;
    }

    console.log('[Database] Empty database detected. Auto-seeding initial blood bank data...');

    // 1. Admin
    const admin = await User.create({
      name: 'Dr. Evelyn Reed (Chief Medical Officer)',
      email: 'admin@lifeline.org',
      password: 'admin123',
      role: 'admin',
      bloodGroup: 'O+',
      phone: '+1 (555) 019-2834',
      city: 'Metro City',
      address: 'Central Hospital Blvd, Suite 400',
    });

    // 2. Eligible Donor
    const eligibleDonor = await User.create({
      name: 'David Miller',
      email: 'donor@lifeline.org',
      password: 'donor123',
      role: 'donor',
      bloodGroup: 'O+',
      phone: '+1 (555) 432-8765',
      age: 29,
      gender: 'Male',
      weight: 72,
      city: 'Metro City',
      address: '742 Evergreen Terrace',
      lastDonationDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000), // 75 days ago (eligible)
      hasChronicIllness: false,
    });

    // 3. Recently Donated Donor
    const recentDonor = await User.create({
      name: 'Sarah Connor',
      email: 'sarah.donor@lifeline.org',
      password: 'donor123',
      role: 'donor',
      bloodGroup: 'A-',
      phone: '+1 (555) 876-1234',
      age: 34,
      gender: 'Female',
      weight: 62,
      city: 'Metro City',
      address: '101 Cyberdyne Way',
      lastDonationDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago (ineligible)
      hasChronicIllness: false,
    });

    // 4. Patients
    const patient1 = await User.create({
      name: 'Marcus Vance',
      email: 'patient@lifeline.org',
      password: 'patient123',
      role: 'patient',
      bloodGroup: 'B+',
      phone: '+1 (555) 321-9870',
      age: 45,
      gender: 'Male',
      city: 'Metro City',
      address: '45 Lincoln St, Apt 3B',
    });

    const patient2 = await User.create({
      name: 'Elena Rostova',
      email: 'elena.patient@lifeline.org',
      password: 'patient123',
      role: 'patient',
      bloodGroup: 'O-',
      phone: '+1 (555) 654-3210',
      age: 38,
      gender: 'Female',
      city: 'Metro City',
      address: '88 Harbour View Rd',
    });

    // Stocks
    const initialStocks = [
      { bloodGroup: 'A+', units: 28, minThreshold: 10 },
      { bloodGroup: 'A-', units: 14, minThreshold: 8 },
      { bloodGroup: 'B+', units: 35, minThreshold: 12 },
      { bloodGroup: 'B-', units: 9, minThreshold: 10 }, // Low stock
      { bloodGroup: 'AB+', units: 18, minThreshold: 8 },
      { bloodGroup: 'AB-', units: 4, minThreshold: 6 }, // Critical shortage
      { bloodGroup: 'O+', units: 42, minThreshold: 15 },
      { bloodGroup: 'O-', units: 6, minThreshold: 12 }, // Critical shortage
    ];
    await BloodStock.insertMany(initialStocks);

    // Blood Requests
    await BloodRequest.create([
      {
        patient: patient1._id,
        patientName: patient1.name,
        bloodGroup: 'B+',
        units: 2,
        hospitalName: 'St. Jude Memorial Hospital',
        hospitalAddress: '200 Health Way, Ward 4B',
        doctorName: 'Dr. Gregory House',
        reason: 'Scheduled Orthopedic Surgery',
        urgency: 'Normal',
        requiredDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        contactPhone: patient1.phone,
        status: 'Pending',
      },
      {
        patient: patient2._id,
        patientName: patient2.name,
        bloodGroup: 'O-',
        units: 3,
        hospitalName: 'General Trauma Emergency Center',
        hospitalAddress: '500 Ambulance Bay',
        doctorName: 'Dr. Allison Cameron',
        reason: 'Accidental Trauma & Acute Blood Loss',
        urgency: 'Critical',
        requiredDate: new Date(),
        contactPhone: patient2.phone,
        status: 'Pending',
      },
      {
        patient: patient1._id,
        patientName: patient1.name,
        bloodGroup: 'B+',
        units: 1,
        hospitalName: 'Metro Health Clinic',
        hospitalAddress: '12 Green St',
        doctorName: 'Dr. Wilson',
        reason: 'Severe Anemia Follow-up',
        urgency: 'Urgent',
        requiredDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        contactPhone: patient1.phone,
        status: 'Completed',
        fulfilledAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
        adminRemarks: 'Delivered to ICU blood bank storage safely',
      },
    ]);

    // Donations
    await Donation.create([
      {
        donor: eligibleDonor._id,
        bloodGroup: 'O+',
        appointmentDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
        timeSlot: '11:00 AM - 12:00 PM',
        donationCenter: 'Central Life Blood Bank & Research Institute',
        status: 'Scheduled',
        units: 1,
      },
      {
        donor: eligibleDonor._id,
        bloodGroup: 'O+',
        appointmentDate: new Date(Date.now() - 75 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        units: 1,
        healthVitals: { hemoglobin: 14.2, bloodPressure: '118/76', pulse: 68 },
        certificateId: 'LIFE-948210-OP',
        remarks: 'Successful voluntary whole blood donation',
      },
      {
        donor: recentDonor._id,
        bloodGroup: 'A-',
        appointmentDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
        status: 'Completed',
        units: 1,
        healthVitals: { hemoglobin: 13.1, bloodPressure: '122/80', pulse: 74 },
        certificateId: 'LIFE-829104-AN',
        remarks: 'Red blood cells collection',
      },
    ]);

    // Camps
    await Camp.create([
      {
        name: 'Metro City University Mega Blood Drive',
        organization: 'Red Cross Youth Chapter & Lifeline Foundation',
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
        startTime: '09:30 AM',
        endTime: '04:30 PM',
        venue: 'Campus Student Union Auditorium, North Gate',
        city: 'Metro City',
        contactPerson: 'Amanda Cooper',
        contactPhone: '+1 (555) 777-8899',
        targetUnits: 150,
        registeredDonors: [eligibleDonor._id],
        status: 'Upcoming',
      },
      {
        name: 'Tech Park Corporate Blood Donation Camp',
        organization: 'Rotary Blood Bank & Silicon Center',
        date: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        startTime: '10:00 AM',
        endTime: '05:00 PM',
        venue: 'Innovation Tower 3, Atrium Hall',
        city: 'Metro City',
        contactPerson: 'James Miller',
        contactPhone: '+1 (555) 333-2211',
        targetUnits: 200,
        registeredDonors: [],
        status: 'Upcoming',
      },
    ]);

    console.log('[Database] Auto-seeding completed successfully!');
  } catch (error) {
    console.error('[Database] Auto-seeding error:', error.message);
  }
};

module.exports = { autoSeedIfEmpty };
