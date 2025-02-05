var gremlin = require('../');

describe('.createClient()', function() {
  it('should create a client with default options', function() {
    var client = gremlin.createClient();

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.should.eql({
      language: 'gremlin-groovy',
      session: false,
      op: 'eval',
      processor: '',
      accept: 'application/json'
    });
  });

  it('should allow setting the `session` option', function() {
    var client = gremlin.createClient({ session: true });

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.session.should.equal(true);
  });

  it('should allow setting the `language` option', function() {
    var client = gremlin.createClient({ language: 'nashorn' });

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.language.should.equal('nashorn');
  });

  it('should allow setting the `op` option', function() {
    var client = gremlin.createClient({ op: 'test' });

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.op.should.equal('test');
  });

  it('should allow setting the `accept` option', function() {
    var client = gremlin.createClient({ accept: 'application/xml' });

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.accept.should.equal('application/xml');
  });

  it('should override a set `processor` option on a per request basis', function(done) {
    var client = gremlin.createClient({ op: 'foo' });

    client.port.should.equal(8182);
    client.host.should.equal('localhost');
    client.options.op.should.equal('foo');

    var s = client.stream('g.v(1)', null, { op: 'eval' });

    s.on('data', function(result) {
      result.length.should.equal(1);
    });

    s.on('end', function() {
      done();
    });
  });
});