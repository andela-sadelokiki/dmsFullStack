'use strict';

describe('DocumentService', function() {
  var DocumentService = null,
    httpBackend = null;

  beforeEach(module('dataHubApp'));

  beforeEach(inject(function(_DocumentService_, $httpBackend) {
    DocumentService = _DocumentService_;
    httpBackend = $httpBackend;
  }));

  it('should create a document', function() {
    httpBackend.whenPOST('http://localhost:3030/documents', 'document').respond({
      title: 'title',
      content: 'content',
    });
    DocumentService.createDocument('document').then(function(doc) {
      expect(doc.data.title).toBe('title');
      expect(doc.data.content).toBe('content')
    });
    httpBackend.flush();
  });

  it('should get all documents', function() {
    httpBackend.whenGET('http://localhost:3030/documents').respond({
      id: 1,
      title: "The five monsters",
    });
    DocumentService.getAllDocuments().then(function(res) {
      httpBackend.expectGET('http://localhost:3030/documents')
      httpBackend.flush();
    });
  });

  it('should update a Document', function() {
    httpBackend.whenPUT('http://localhost:3030/documents/1').respond({
      success: true,
      message: 'Document updated!'
    });
    DocumentService.updateDocument(1).then(function(res) {
      expect(res.data.success).toBe(true);
      expect(res.data.message).toBe('Document updated!');
    });
    httpBackend.flush();
  });

  it('should delete a document', function() {
    httpBackend.whenDELETE('http://localhost:3030/documents/2').respond({
      success: true,
      message: 'Document deleted!'
    });
    DocumentService.deleteDocument(2).then(function(res) {
      expect(res.message).toBe('Document deleted!');
    });
    httpBackend.flush();
  });
});
