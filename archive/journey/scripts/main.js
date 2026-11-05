/* 
Author: Davis D. Boudreau
Project: Campus Goal - NSCC Journey 
Project Brief:  - Development of a client server application to Connect with students 
at key locations to carpool, give a ride or get a ride to any school in Nova Scotia.
- Ensuring students have the best opportunity to gain access to affortable transportation.
 
Semester: Winter 2025
Release: Concept 
*/

document.addEventListener('DOMContentLoaded', () => {
    loadPartbyID('heroLeftContainer', '../webparts/hero/hero.html');
    loadPartbyID('heroRightContainer', '../webparts/hero/heroimage.html');
    loadPartbyID('learnmoreLeftContainer', '../webparts/learnmore/learnmoremap.html', initLearnMoreMap);
    loadPartbyID('learnmoreRightContainer', '../webparts/learnmore/learnmore.html');
});


// Define a function to create custom icons with consistent properties for LeafLet
    function createCustomIcon(iconUrl) {
        return L.icon({
            iconUrl: iconUrl,
            iconSize: [42, 42],
            iconAnchor: [12, 42],
            popupAnchor: [1, -34],
            shadowSize: [42, 42]
        });
    }

// Define custom icons using the helper function
    const icons = {
        nsccIcon: createCustomIcon('../assets/icons/nscc-school-icon.png'),
        dalUIcon: createCustomIcon('../assets/icons/DalhousieUniversity.png'),
        acadiaUIcon: createCustomIcon('../assets/icons/AcadiaUniversity.png'),
        UKingsCollegeIcon: createCustomIcon('../assets/icons/UniversityKingsCollege.png'),
        StMarysUIcon: createCustomIcon('../assets/icons/StMarysUniversity.png'),
        nscadUIcon: createCustomIcon('../assets/icons/nscadU.png'),
        mountstvincentUIcon: createCustomIcon('../assets/icons/mountsaintvincent.png'),
        stfxUIcon: createCustomIcon('../assets/icons/StFXUniversity.png'),
        cbUIcon: createCustomIcon('../assets/icons/CapeBretonUniversity.png'),
        UniversiteSainteAnne: createCustomIcon('../assets/icons/UniversiteSainteAnne.png'),
        gaelicCollegeIcon: createCustomIcon('../assets/icons/GaelicCollege.png'),
        coastGuardCollegeIcon: createCustomIcon('../assets/icons/CoastGuardCollege.png'),
        CBBCCareerCollege: createCustomIcon('../assets/icons/CBBCCareerCollege.png'),
        MaritimeBusinessCollege: createCustomIcon('../assets/icons/MaritimeBusinessCollege.png'),
        NSCollegeofEarlyChildhood: createCustomIcon('../assets/icons/NSCollegeofEarlyChildhood.png'),
        AcademyofLearningCollage: createCustomIcon('../assets/icons/AcademyofLearningCollage.png'),
        AcademyofCosmetology: createCustomIcon('../assets/icons/AcademyofCosmetology.png'),
        HairDesignCentreLimited: createCustomIcon('../assets/icons/HairDesignCentreLimited.png'),
        CCATCM: createCustomIcon('../assets/icons/CCATCM.png'),
        CarpenterMilwrightCollege: createCustomIcon('../assets/icons/CarpenterMilwrightCollege.png'),
        EasternEstheticsCareerCollege: createCustomIcon('../assets/icons/EasternEstheticsCareerCollege.png'),
        HairMastes: createCustomIcon('../assets/icons/HairMastes.png'),
        DexterInstitute: createCustomIcon('../assets/icons/DexterInstitute.png'),
        PeopleWorx: createCustomIcon('../assets/icons/PeopleWorx.png'),
        EasternCollege: createCustomIcon('../assets/icons/EasternCollege.png'),
        MedavieHealthEd: createCustomIcon('../assets/icons/MedavieHealthEd.png'),
        TransportTrainingCentres: createCustomIcon('../assets/icons/TransportTrainingCentres.png'),
        IslandCareerAcademy: createCustomIcon('../assets/icons/IslandCareerAcademy.png'),
        ICTNorthumberlandCollege: createCustomIcon('../assets/icons/ICTNorthumberlandCollege.png'),
        Meti: createCustomIcon('../assets/icons/Meti.png'),
        CentreforDistanceEducation: createCustomIcon('../assets/icons/CentreforDistanceEducation.png'),
        CanadianCollegeofMassageHydrotherapy: createCustomIcon('../assets/icons/CanadianCollegeofMassageHydrotherapy.png'),
        NovaScotiaFirefightersSchool: createCustomIcon('../assets/icons/NovaScotiaFirefightersSchool.png'),
        ElevateBeautyInstituteofCosmetology: createCustomIcon('../assets/icons/ElevateBeautyInstituteofCosmetology.png'),
        BretonCommercialTruckTraining: createCustomIcon('../assets/icons/BretonCommercialTruckTraining.png'),
        FutureWorx: createCustomIcon('../assets/icons/FutureWorx.png'),
        BuildingTradesAdvancementCollege: createCustomIcon('../assets/icons/BuildingTradesAdvancementCollege.png'),
        SPCACollegeofAnimalWelfare: createCustomIcon('../assets/icons/SPCACollegeofAnimalWelfare.png'),
        OxfordInternational: createCustomIcon('../assets/icons/OxfordInternational.png'),
        AnnapolisValleyFlightTrainingCentre: createCustomIcon('../assets/icons/AnnapolisValleyFlightTrainingCentre.png'),
        HalifaxRegionalPoliceTrainingSchool: createCustomIcon('../assets/icons/HalifaxRegionalPoliceTrainingSchool.png'),
        MaritimeConservatoryofPerformingArts: createCustomIcon('../assets/icons/MaritimeConservatoryofPerformingArts.png'),
        //
        meetingPointIcon: createCustomIcon('../assets/icons/meeting-point-icon.png'),
        hospitalIcon: createCustomIcon('../assets/icons/hospital-icon.png'),
        carPoolParkIcon: createCustomIcon('../assets/icons/CarpoolPark.png')
    };

    // Define the mapping of stop_id ranges to icon keys
    const stopIdToIconMap = {
        '1000-1019': 'nsccIcon',
        '1110-1119': 'acadiaUIcon',
        '1120-1129': 'UKingsCollegeIcon',
        '1130-1139': 'StMarysUIcon',
        '1140-1149': 'nscadUIcon',
        '1150-1159': 'mountstvincentUIcon',
        '1160-1169': 'stfxUIcon',
        '1170-1189': 'cbUIcon',
        '1190-1199': 'UniversiteSainteAnne',
        '1200-1249': 'dalUIcon',
        '1250-1259': 'gaelicCollegeIcon',
        '1260-1269': 'coastGuardCollegeIcon',
        '2000-2999': 'meetingPointIcon',
        '3000-3999': 'carPoolParkIcon',
        '5000-5009': 'CBBCCareerCollege',
        '5010-5019': 'MaritimeBusinessCollege',
        '5020-5029': 'NSCollegeofEarlyChildhood',
        '5030-5039': 'AcademyofLearningCollage',
        '5040-5049': 'AcademyofCosmetology',
        '5050-5059': 'HairDesignCentreLimited',
        '5060-5069': 'CCATCM',
        '5070-5079': 'CarpenterMilwrightCollege',
        '5080-5089': 'EasternEstheticsCareerCollege',
        '5090-5099': 'HairMastes',
        '5100-5109': 'DexterInstitute',
        '5110-5119': 'PeopleWorx',
        '5120-5129': 'MedavieHealthEd',
        '5130-5139': 'TransportTrainingCentres',
        '5140-5149': 'IslandCareerAcademy',
        '5150-5159': 'ICTNorthumberlandCollege',
        '5160-5169': 'Meti',
        '5170-5179': 'CentreforDistanceEducation',
        '5180-5189': 'CanadianCollegeofMassageHydrotherapy',
        '5190-5199': 'AtlanticFlightAttendantAcademy',
        '5200-5209': 'NovaScotiaFirefightersSchool',
        '5210-5219': 'MedavieHealthEd',
        '5220-5229': 'ElevateBeautyInstituteofCosmetology',
        '5230-5239': 'BretonCommercialTruckTraining',
        '5240-5249': 'FutureWorx',
        '5250-5259': 'BuildingTradesAdvancementCollege',
        '5260-5269': 'SPCACollegeofAnimalWelfare',
        '5270-5279': 'OxfordInternational',
        '5280-5289': 'AnnapolisValleyFlightTrainingCentre',
        '5290-5299': 'HalifaxRegionalPoliceTrainingSchool',
        '5300-5309': 'MaritimeConservatoryofPerformingArts',
        '5310-5319': 'EasternCollege',
        
        // Add mappings for other stop_id ranges as needed
    };



