// specialties.ts
export interface Specialty {
  _id: string;
  name: string;
  description?: string;
}

export const SPECIALTIES: Specialty[] = [
  { _id: '1', name: 'Cardiology', description: 'Heart and blood vessel conditions' },
  { _id: '2', name: 'Orthopedics', description: 'Musculoskeletal system conditions' },
  { _id: '3', name: 'Pediatrics', description: 'Child healthcare' },
  { _id: '4', name: 'Neurology', description: 'Brain, spine and nervous system conditions' },
  { _id: '5', name: 'Dermatology', description: 'Skin conditions' },
  { _id: '6', name: 'Ophthalmology', description: 'Eye conditions' },
  { _id: '7', name: 'ENT', description: 'Ear, nose and throat conditions' },
  { _id: '8', name: 'Dentistry', description: 'Dental care' },
  { _id: '9', name: 'Gynecology', description: "Women's health" },
  { _id: '10', name: 'Urology', description: 'Urinary system conditions' },
];