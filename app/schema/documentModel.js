'use strict';

var mongoose = require("mongoose"),
  Schema = mongoose.Schema;

var documentSchema = new Schema({
  ownerId: {
    type: Schema.ObjectId,
    ref: 'User'
  },
  title: {
    type: String,
    required: true,
    unique: true
  },
  content: {
    type: String
  },
  dateCreated: {
    type: String
  },
  lastModified: {
    type: Date
  }
});

documentSchema.pre('save', function(done) {
  var now = new Date();
  this.updated_at = now;
  if (!this.created_at) {
    this.created_at = now;
  }
  done();
});

mongoose.model('Document', documentSchema);
