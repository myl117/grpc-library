// source: proto/library.proto
/**
 * @fileoverview
 * @enhanceable
 * @suppress {missingRequire} reports error on implicit type usages.
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!
/* eslint-disable */
// @ts-nocheck

var jspb = require('google-protobuf');
var goog = jspb;
var global =
    (typeof globalThis !== 'undefined' && globalThis) ||
    (typeof window !== 'undefined' && window) ||
    (typeof global !== 'undefined' && global) ||
    (typeof self !== 'undefined' && self) ||
    (function () { return this; }).call(null) ||
    Function('return this')();

goog.exportSymbol('proto.BookList', null, global);
goog.exportSymbol('proto.BookRequest', null, global);
goog.exportSymbol('proto.BookResponse', null, global);
goog.exportSymbol('proto.CreateBookRequest', null, global);
goog.exportSymbol('proto.UpdateBookRequest', null, global);
goog.exportSymbol('proto.DeleteBookResponse', null, global);
goog.exportSymbol('proto.Empty', null, global);

// ─── Empty ────────────────────────────────────────────────────────────────────

proto.Empty = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.Empty, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.Empty.displayName = 'proto.Empty'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.Empty.prototype.toObject = function(opt_includeInstance) {
  return proto.Empty.toObject(opt_includeInstance, this);
};
proto.Empty.toObject = function(includeInstance, msg) {
  var f, obj = {};
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.Empty.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.Empty;
  return proto.Empty.deserializeBinaryFromReader(msg, reader);
};

proto.Empty.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    reader.skipField();
  }
  return msg;
};

proto.Empty.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.Empty.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.Empty.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
};

// ─── BookRequest ──────────────────────────────────────────────────────────────

proto.BookRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.BookRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.BookRequest.displayName = 'proto.BookRequest'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.BookRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.BookRequest.toObject(opt_includeInstance, this);
};
proto.BookRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0)
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.BookRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.BookRequest;
  return proto.BookRequest.deserializeBinaryFromReader(msg, reader);
};

proto.BookRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};

proto.BookRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.BookRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.BookRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) { writer.writeInt32(1, f); }
};

proto.BookRequest.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.BookRequest.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};

// ─── BookResponse ─────────────────────────────────────────────────────────────

proto.BookResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.BookResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.BookResponse.displayName = 'proto.BookResponse'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.BookResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.BookResponse.toObject(opt_includeInstance, this);
};
proto.BookResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
title: jspb.Message.getFieldWithDefault(msg, 2, ""),
author: jspb.Message.getFieldWithDefault(msg, 3, ""),
available: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
isbn: jspb.Message.getFieldWithDefault(msg, 5, ""),
description: jspb.Message.getFieldWithDefault(msg, 6, ""),
coverUrl: jspb.Message.getFieldWithDefault(msg, 7, ""),
publishedYear: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.BookResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.BookResponse;
  return proto.BookResponse.deserializeBinaryFromReader(msg, reader);
};

proto.BookResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setId(value);
      break;
    case 2:
      var value = /** @type {string} */ (reader.readString());
      msg.setTitle(value);
      break;
    case 3:
      var value = /** @type {string} */ (reader.readString());
      msg.setAuthor(value);
      break;
    case 4:
      var value = /** @type {boolean} */ (reader.readBool());
      msg.setAvailable(value);
      break;
    case 5:
      var value = /** @type {string} */ (reader.readString());
      msg.setIsbn(value);
      break;
    case 6:
      var value = /** @type {string} */ (reader.readString());
      msg.setDescription(value);
      break;
    case 7:
      var value = /** @type {string} */ (reader.readString());
      msg.setCoverUrl(value);
      break;
    case 8:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setPublishedYear(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};

proto.BookResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.BookResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.BookResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) { writer.writeInt32(1, f); }
  f = message.getTitle();
  if (f.length > 0) { writer.writeString(2, f); }
  f = message.getAuthor();
  if (f.length > 0) { writer.writeString(3, f); }
  f = message.getAvailable();
  if (f) { writer.writeBool(4, f); }
  f = message.getIsbn();
  if (f.length > 0) { writer.writeString(5, f); }
  f = message.getDescription();
  if (f.length > 0) { writer.writeString(6, f); }
  f = message.getCoverUrl();
  if (f.length > 0) { writer.writeString(7, f); }
  f = message.getPublishedYear();
  if (f !== 0) { writer.writeInt32(8, f); }
};

proto.BookResponse.prototype.getId = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};
proto.BookResponse.prototype.setId = function(value) {
  return jspb.Message.setProto3IntField(this, 1, value);
};
proto.BookResponse.prototype.getTitle = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 2, ""));
};
proto.BookResponse.prototype.setTitle = function(value) {
  return jspb.Message.setProto3StringField(this, 2, value);
};
proto.BookResponse.prototype.getAuthor = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 3, ""));
};
proto.BookResponse.prototype.setAuthor = function(value) {
  return jspb.Message.setProto3StringField(this, 3, value);
};
proto.BookResponse.prototype.getAvailable = function() {
  return /** @type {boolean} */ (jspb.Message.getBooleanFieldWithDefault(this, 4, false));
};
proto.BookResponse.prototype.setAvailable = function(value) {
  return jspb.Message.setProto3BooleanField(this, 4, value);
};
proto.BookResponse.prototype.getIsbn = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 5, ""));
};
proto.BookResponse.prototype.setIsbn = function(value) {
  return jspb.Message.setProto3StringField(this, 5, value);
};
proto.BookResponse.prototype.getDescription = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 6, ""));
};
proto.BookResponse.prototype.setDescription = function(value) {
  return jspb.Message.setProto3StringField(this, 6, value);
};
proto.BookResponse.prototype.getCoverUrl = function() {
  return /** @type {string} */ (jspb.Message.getFieldWithDefault(this, 7, ""));
};
proto.BookResponse.prototype.setCoverUrl = function(value) {
  return jspb.Message.setProto3StringField(this, 7, value);
};
proto.BookResponse.prototype.getPublishedYear = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 8, 0));
};
proto.BookResponse.prototype.setPublishedYear = function(value) {
  return jspb.Message.setProto3IntField(this, 8, value);
};

// ─── CreateBookRequest ────────────────────────────────────────────────────────

proto.CreateBookRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.CreateBookRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.CreateBookRequest.displayName = 'proto.CreateBookRequest'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.CreateBookRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.CreateBookRequest.toObject(opt_includeInstance, this);
};
proto.CreateBookRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
title: jspb.Message.getFieldWithDefault(msg, 1, ""),
author: jspb.Message.getFieldWithDefault(msg, 2, ""),
available: jspb.Message.getBooleanFieldWithDefault(msg, 3, false),
isbn: jspb.Message.getFieldWithDefault(msg, 4, ""),
description: jspb.Message.getFieldWithDefault(msg, 5, ""),
coverUrl: jspb.Message.getFieldWithDefault(msg, 6, ""),
publishedYear: jspb.Message.getFieldWithDefault(msg, 7, 0)
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.CreateBookRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.CreateBookRequest;
  return proto.CreateBookRequest.deserializeBinaryFromReader(msg, reader);
};

proto.CreateBookRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1: msg.setTitle(reader.readString()); break;
    case 2: msg.setAuthor(reader.readString()); break;
    case 3: msg.setAvailable(reader.readBool()); break;
    case 4: msg.setIsbn(reader.readString()); break;
    case 5: msg.setDescription(reader.readString()); break;
    case 6: msg.setCoverUrl(reader.readString()); break;
    case 7: msg.setPublishedYear(reader.readInt32()); break;
    default: reader.skipField(); break;
    }
  }
  return msg;
};

proto.CreateBookRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.CreateBookRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.CreateBookRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getTitle();
  if (f.length > 0) { writer.writeString(1, f); }
  f = message.getAuthor();
  if (f.length > 0) { writer.writeString(2, f); }
  f = message.getAvailable();
  if (f) { writer.writeBool(3, f); }
  f = message.getIsbn();
  if (f.length > 0) { writer.writeString(4, f); }
  f = message.getDescription();
  if (f.length > 0) { writer.writeString(5, f); }
  f = message.getCoverUrl();
  if (f.length > 0) { writer.writeString(6, f); }
  f = message.getPublishedYear();
  if (f !== 0) { writer.writeInt32(7, f); }
};

proto.CreateBookRequest.prototype.getTitle = function() { return jspb.Message.getFieldWithDefault(this, 1, ""); };
proto.CreateBookRequest.prototype.setTitle = function(v) { return jspb.Message.setProto3StringField(this, 1, v); };
proto.CreateBookRequest.prototype.getAuthor = function() { return jspb.Message.getFieldWithDefault(this, 2, ""); };
proto.CreateBookRequest.prototype.setAuthor = function(v) { return jspb.Message.setProto3StringField(this, 2, v); };
proto.CreateBookRequest.prototype.getAvailable = function() { return jspb.Message.getBooleanFieldWithDefault(this, 3, false); };
proto.CreateBookRequest.prototype.setAvailable = function(v) { return jspb.Message.setProto3BooleanField(this, 3, v); };
proto.CreateBookRequest.prototype.getIsbn = function() { return jspb.Message.getFieldWithDefault(this, 4, ""); };
proto.CreateBookRequest.prototype.setIsbn = function(v) { return jspb.Message.setProto3StringField(this, 4, v); };
proto.CreateBookRequest.prototype.getDescription = function() { return jspb.Message.getFieldWithDefault(this, 5, ""); };
proto.CreateBookRequest.prototype.setDescription = function(v) { return jspb.Message.setProto3StringField(this, 5, v); };
proto.CreateBookRequest.prototype.getCoverUrl = function() { return jspb.Message.getFieldWithDefault(this, 6, ""); };
proto.CreateBookRequest.prototype.setCoverUrl = function(v) { return jspb.Message.setProto3StringField(this, 6, v); };
proto.CreateBookRequest.prototype.getPublishedYear = function() { return jspb.Message.getFieldWithDefault(this, 7, 0); };
proto.CreateBookRequest.prototype.setPublishedYear = function(v) { return jspb.Message.setProto3IntField(this, 7, v); };

// ─── UpdateBookRequest ────────────────────────────────────────────────────────

proto.UpdateBookRequest = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.UpdateBookRequest, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.UpdateBookRequest.displayName = 'proto.UpdateBookRequest'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.UpdateBookRequest.prototype.toObject = function(opt_includeInstance) {
  return proto.UpdateBookRequest.toObject(opt_includeInstance, this);
};
proto.UpdateBookRequest.toObject = function(includeInstance, msg) {
  var f, obj = {
id: jspb.Message.getFieldWithDefault(msg, 1, 0),
title: jspb.Message.getFieldWithDefault(msg, 2, ""),
author: jspb.Message.getFieldWithDefault(msg, 3, ""),
available: jspb.Message.getBooleanFieldWithDefault(msg, 4, false),
isbn: jspb.Message.getFieldWithDefault(msg, 5, ""),
description: jspb.Message.getFieldWithDefault(msg, 6, ""),
coverUrl: jspb.Message.getFieldWithDefault(msg, 7, ""),
publishedYear: jspb.Message.getFieldWithDefault(msg, 8, 0)
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.UpdateBookRequest.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.UpdateBookRequest;
  return proto.UpdateBookRequest.deserializeBinaryFromReader(msg, reader);
};

proto.UpdateBookRequest.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1: msg.setId(reader.readInt32()); break;
    case 2: msg.setTitle(reader.readString()); break;
    case 3: msg.setAuthor(reader.readString()); break;
    case 4: msg.setAvailable(reader.readBool()); break;
    case 5: msg.setIsbn(reader.readString()); break;
    case 6: msg.setDescription(reader.readString()); break;
    case 7: msg.setCoverUrl(reader.readString()); break;
    case 8: msg.setPublishedYear(reader.readInt32()); break;
    default: reader.skipField(); break;
    }
  }
  return msg;
};

proto.UpdateBookRequest.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.UpdateBookRequest.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.UpdateBookRequest.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getId();
  if (f !== 0) { writer.writeInt32(1, f); }
  f = message.getTitle();
  if (f.length > 0) { writer.writeString(2, f); }
  f = message.getAuthor();
  if (f.length > 0) { writer.writeString(3, f); }
  f = message.getAvailable();
  if (f) { writer.writeBool(4, f); }
  f = message.getIsbn();
  if (f.length > 0) { writer.writeString(5, f); }
  f = message.getDescription();
  if (f.length > 0) { writer.writeString(6, f); }
  f = message.getCoverUrl();
  if (f.length > 0) { writer.writeString(7, f); }
  f = message.getPublishedYear();
  if (f !== 0) { writer.writeInt32(8, f); }
};

proto.UpdateBookRequest.prototype.getId = function() { return jspb.Message.getFieldWithDefault(this, 1, 0); };
proto.UpdateBookRequest.prototype.setId = function(v) { return jspb.Message.setProto3IntField(this, 1, v); };
proto.UpdateBookRequest.prototype.getTitle = function() { return jspb.Message.getFieldWithDefault(this, 2, ""); };
proto.UpdateBookRequest.prototype.setTitle = function(v) { return jspb.Message.setProto3StringField(this, 2, v); };
proto.UpdateBookRequest.prototype.getAuthor = function() { return jspb.Message.getFieldWithDefault(this, 3, ""); };
proto.UpdateBookRequest.prototype.setAuthor = function(v) { return jspb.Message.setProto3StringField(this, 3, v); };
proto.UpdateBookRequest.prototype.getAvailable = function() { return jspb.Message.getBooleanFieldWithDefault(this, 4, false); };
proto.UpdateBookRequest.prototype.setAvailable = function(v) { return jspb.Message.setProto3BooleanField(this, 4, v); };
proto.UpdateBookRequest.prototype.getIsbn = function() { return jspb.Message.getFieldWithDefault(this, 5, ""); };
proto.UpdateBookRequest.prototype.setIsbn = function(v) { return jspb.Message.setProto3StringField(this, 5, v); };
proto.UpdateBookRequest.prototype.getDescription = function() { return jspb.Message.getFieldWithDefault(this, 6, ""); };
proto.UpdateBookRequest.prototype.setDescription = function(v) { return jspb.Message.setProto3StringField(this, 6, v); };
proto.UpdateBookRequest.prototype.getCoverUrl = function() { return jspb.Message.getFieldWithDefault(this, 7, ""); };
proto.UpdateBookRequest.prototype.setCoverUrl = function(v) { return jspb.Message.setProto3StringField(this, 7, v); };
proto.UpdateBookRequest.prototype.getPublishedYear = function() { return jspb.Message.getFieldWithDefault(this, 8, 0); };
proto.UpdateBookRequest.prototype.setPublishedYear = function(v) { return jspb.Message.setProto3IntField(this, 8, v); };

// ─── DeleteBookResponse ───────────────────────────────────────────────────────

proto.DeleteBookResponse = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, null, null);
};
goog.inherits(proto.DeleteBookResponse, jspb.Message);
if (goog.DEBUG && !COMPILED) { proto.DeleteBookResponse.displayName = 'proto.DeleteBookResponse'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.DeleteBookResponse.prototype.toObject = function(opt_includeInstance) {
  return proto.DeleteBookResponse.toObject(opt_includeInstance, this);
};
proto.DeleteBookResponse.toObject = function(includeInstance, msg) {
  var f, obj = {
success: jspb.Message.getBooleanFieldWithDefault(msg, 1, false),
message: jspb.Message.getFieldWithDefault(msg, 2, "")
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.DeleteBookResponse.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.DeleteBookResponse;
  return proto.DeleteBookResponse.deserializeBinaryFromReader(msg, reader);
};

proto.DeleteBookResponse.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1: msg.setSuccess(reader.readBool()); break;
    case 2: msg.setMessage(reader.readString()); break;
    default: reader.skipField(); break;
    }
  }
  return msg;
};

proto.DeleteBookResponse.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.DeleteBookResponse.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.DeleteBookResponse.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getSuccess();
  if (f) { writer.writeBool(1, f); }
  f = message.getMessage();
  if (f.length > 0) { writer.writeString(2, f); }
};

proto.DeleteBookResponse.prototype.getSuccess = function() { return jspb.Message.getBooleanFieldWithDefault(this, 1, false); };
proto.DeleteBookResponse.prototype.setSuccess = function(v) { return jspb.Message.setProto3BooleanField(this, 1, v); };
proto.DeleteBookResponse.prototype.getMessage = function() { return jspb.Message.getFieldWithDefault(this, 2, ""); };
proto.DeleteBookResponse.prototype.setMessage = function(v) { return jspb.Message.setProto3StringField(this, 2, v); };

// ─── BookList ─────────────────────────────────────────────────────────────────

proto.BookList = function(opt_data) {
  jspb.Message.initialize(this, opt_data, 0, -1, proto.BookList.repeatedFields_, null);
};
goog.inherits(proto.BookList, jspb.Message);
proto.BookList.repeatedFields_ = [1];
if (goog.DEBUG && !COMPILED) { proto.BookList.displayName = 'proto.BookList'; }

if (jspb.Message.GENERATE_TO_OBJECT) {
proto.BookList.prototype.toObject = function(opt_includeInstance) {
  return proto.BookList.toObject(opt_includeInstance, this);
};
proto.BookList.toObject = function(includeInstance, msg) {
  var f, obj = {
booksList: jspb.Message.toObjectList(msg.getBooksList(),
    proto.BookResponse.toObject, includeInstance)
  };
  if (includeInstance) { obj.$jspbMessageInstance = msg; }
  return obj;
};
}

proto.BookList.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.BookList;
  return proto.BookList.deserializeBinaryFromReader(msg, reader);
};

proto.BookList.deserializeBinaryFromReader = function(msg, reader) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) { break; }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = new proto.BookResponse;
      reader.readMessage(value, proto.BookResponse.deserializeBinaryFromReader);
      msg.addBooks(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};

proto.BookList.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.BookList.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

proto.BookList.serializeBinaryToWriter = function(message, writer) {
  var f = undefined;
  f = message.getBooksList();
  if (f.length > 0) {
    writer.writeRepeatedMessage(1, f, proto.BookResponse.serializeBinaryToWriter);
  }
};

proto.BookList.prototype.getBooksList = function() {
  return /** @type{!Array<!proto.BookResponse>} */ (
    jspb.Message.getRepeatedWrapperField(this, proto.BookResponse, 1));
};
proto.BookList.prototype.setBooksList = function(value) {
  return jspb.Message.setRepeatedWrapperField(this, 1, value);
};
proto.BookList.prototype.addBooks = function(opt_value, opt_index) {
  return jspb.Message.addToRepeatedWrapperField(this, 1, opt_value, proto.BookResponse, opt_index);
};
proto.BookList.prototype.clearBooksList = function() {
  return this.setBooksList([]);
};

goog.object.extend(exports, proto);
