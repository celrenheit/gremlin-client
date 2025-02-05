/*jshint -W030 */
var gremlin = require('../');

describe('.exec()', function() {
  it('should return a result and a response', function(done) {
    var client = gremlin.createClient();

    client.execute('g.V()', function(err, result, response, command) {
      (err === null).should.be.true;
      result.length.should.equal(6);
      response.should.exist;
      response.code.should.equal(299);
      done();
    });
  });

  it('should queue command before the client is connected', function(done) {
    var client = gremlin.createClient();

    client.execute('g.V()', function() { });
    client.queue.length.should.equal(1);
    done();
  });

  it('should send commands after the client is connected', function(done) {
    var client = gremlin.createClient();

    client.on('connect', function() {
      client.execute('g.V()', function(err, result) {
        (err === null).should.be.true;
        result.length.should.equal(6);
        done();
      });
    });
  });

  it('should handle bound parameters', function(done) {
    var client = gremlin.createClient();

    client.execute('g.v(id)', { id: 1 }, function(err, result) {
      (err === null).should.be.true;
      result.length.should.equal(1);
      done();
    });
  });

  it('should handle optional args', function(done) {
    var client = gremlin.createClient();

    client.execute('g.v(1)', null, { args: { language: 'nashorn' }}, function(err, result) {
      (err === null).should.be.true;
      result.length.should.equal(1);
      done();
    });
  });

  it('should handle bindings and optional args', function(done) {
    var client = gremlin.createClient();

    client.execute('g.v(id)', { id : 1 }, { args: { language: 'nashorn' }}, function(err, result) {
      (err === null).should.be.true;
      result.length.should.equal(1);
      done();
    });
  });
});