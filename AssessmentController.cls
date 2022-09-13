public with sharing class AssessmentController {
    @AuraEnabled(cacheable = true)
    public static List<Assessment_Competency__c> getAssessments(id recordId){
        //String currentID = ApexPages.CurrentPage().getparameters().get('id');
        //system.debug(currentID);
        system.debug('this is my record id ' + recordId);
        return [SELECT Name, Assessment__r.Name, Competency__r.Name, Employee_Evaluation__c, Expected_Proficiency_Level__c, Peer_Evaluation__c, Proficiency_Gap__c FROM Assessment_Competency__c WHERE Assessment__r.Status__c = 'Finalized' AND Peer_Evaluation__c != '' AND Assessment__r.Assessment_Related_TO__c = :recordId];
    } 
}
