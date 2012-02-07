
var simpleEvents = require('nodeunit').testCase;
var EventVat = require('../lib/eventvat');

module.exports = simpleEvents({

  setUp: function (test) {
    
    if (typeof test === 'function') {
      test();
    }
    else {
      test.done();
    }
  },

  tearDown: function (test) {
    if (typeof test === 'function') {
      test();
    }
    else {
      test.done();
    }
  },

  'Raise event on `get` method invokation': function (test) {

    var vat = EventVat();
    var samplevalue = 10;

    vat.on('get', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, samplevalue, 'The value was captured by the event.');
    });

    vat.on('get foo', function(value) {
      test.equal(value, samplevalue, 'The value was captured by the event.');
    });

    var samplevalue = 10;

    vat.set('foo', samplevalue);
    var val = vat.get('foo');

    test.expect(3);
    vat.die();
    test.done();
    

  },  
  'Raise event on `set` method invokation': function (test) {

    var vat = EventVat();
    
    vat.on('set', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, 10);
    });

    vat.on('set foo', function(value) {
      test.equal(value, 10);
    });
    
    vat.set('foo', 10);

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `setnx` method invokation': function (test) {

    var vat = EventVat();

    vat.on('setnx', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, 'bar');
    });

    vat.on('setnx foo', function(value) {
      test.equal(value, 'bar');
    });

    vat.setnx('foo', 'bar');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `rename` method invokation': function (test) {

    var vat = EventVat();

    vat.on('rename', function(oldKey, newKey) {
      test.equal(oldKey, 'a');
      test.equal(newKey, 'b');
    });

    vat.on('rename a', function(newKey) {
      test.equal(newKey, 'b');
    });

    vat.set('a', 1);
    vat.rename('a', 'b');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `decr` method invokation': function (test) {

    var vat = EventVat();

    vat.on('decr', function(key, newValue) {
      test.equal(key, 'foo');
      test.equal(newValue, 2);
    });

    vat.on('decrby', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 1);
      test.equal(newValue, 2);
    });

    vat.on('decr foo', function(newValue) {
      test.equal(newValue, 2);
    });

    vat.on('decrby foo', function(value, newValue) {
      test.equal(value, 1);
      test.equal(newValue, 2);
    });

    vat.set('foo', 3);
    vat.decr('foo');

    test.expect(8);
    vat.die();
    test.done();

  },    
  'Raise event on `incr` method invokation': function (test) {

    var vat = EventVat();

    vat.on('incr', function(key, newValue) {
      test.equal(key, 'foo');
      test.equal(newValue, 4);
    });

    vat.on('incrby', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 1);
      test.equal(newValue, 4);
    });

    vat.on('incr foo', function(newValue) {
      test.equal(newValue, 4);
    });

    vat.on('incrby foo', function(value, newValue) {
      test.equal(value, 1);
      test.equal(newValue, 4);
    });

    vat.set('foo', 3);
    vat.incr('foo');

    test.expect(8);
    vat.die();
    test.done();

  },
  'Raise event on `swap` method invokation': function (test) {
    
    var vat = EventVat();

    vat.on('swap', function(a, b, depth) {
      test.equal(a, 'a');
      test.equal(b, 'b');
      test.ok(!depth);
    });

    vat.on('swap a', function(b, depth) {
      test.equal(b, 'b');
      test.ok(!depth);
    });

    vat.on('swap b', function(b, depth) {
      test.equal(b, 'a');
      test.ok(!depth);
    });

    vat.set('a', 1);
    vat.set('b', 2);
    vat.swap('a', 'b');

    test.expect(7); 
    vat.die();
    test.done();
    
  },
  'Raise event on `findin` method invokation': function (test) {
    
    var vat = EventVat();

    vat.on('findin', function(key, value, index) {
      test.equal(key, 'foo');
      test.equal(value, 'll');
    });

    vat.on('findin foo', function(value, index) {
      test.equal(value, 'll');
    });

    vat.set('foo', 'hello');
    vat.findin('foo', 'll');

    test.expect(3);
    vat.die();
    test.done(); 
    
  },
  'Raise event on `del` method invokation': function (test) {
    
    var vat = EventVat();

    vat.on('del', function(key) {
      test.equal(key, 'foo');
    });

    vat.on('del foo', function() {
      test.ok(true);
    });

    vat.set('foo', 'hi');
    vat.del('foo');

    test.expect(2);
    vat.die();
    test.done();
    
  },
  'Raise event on `exists` method invokation': function (test) {
    
    var vat = EventVat();

    vat.once('exists', function(key, exists) {
      test.equal(key, 'foo');
      test.equal(exists, true);
    });

    vat.on('exists bar', function(exists) {
      test.equal(exists, false);
    });

    vat.set('foo', 'hi');
    vat.exists('foo');
    vat.exists('bar');

    test.expect(3);
    vat.die();
    test.done();
    
  },
  
  'Raise event on `persist` method invokation': function (test) {
    
    var vat = EventVat();

    vat.on('persist', function(key) {
      test.equal(key, 'foo');
    });

    vat.on('persist foo', function() {
      test.ok(true, 'persist event emitted');
    });

    vat.set('foo', 'bar', 100);
    vat.persist('foo');

    test.expect(2);
    vat.die();
    test.done();
    
  },
  'Raise event on `append` method invokation': function (test) {
    
    var vat = EventVat();

    vat.on('append', function(key, value, newValue) {
      test.equal(key, 'foo');
      test.equal(value, 'bar');
      test.equal(newValue, 'foobar');
    });

    vat.on('append foo', function(value, newValue) {
      test.equal(value, 'bar');
      test.equal(newValue, 'foobar');
    });

    vat.set('foo', 'foo');
    vat.append('foo', 'bar');

    test.expect(5);
    vat.die();
    test.done();
    
  },
  'Raise event on `expire` method invokation': function(test) {

    var vat = EventVat();

    vat.on('expire', function(key, ttl) {
      test.equal(key, 'foo');
      test.equal(ttl, 100);
    });

    vat.on('expire foo', function(ttl) {
      test.equal(ttl, 100);
    });

    vat.set('foo', 'bar');
    vat.expire('foo', 100);

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `expireat` method invokation': function(test) {

    var vat = EventVat();
    var ts = ~~(new Date() / 1000) + 100;

    vat.on('expireat', function(key, dueDate) {
      test.equal(key, 'foo');
      test.equal(dueDate, ts);
    });

    vat.on('expireat foo', function(dueDate) {
      test.equal(dueDate, ts);
    });

    vat.set('foo', 'bar');
    vat.expireat('foo', ts);

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `ttl` method invokation': function(test) {

    var vat = EventVat();

    vat.on('ttl', function(key, ttl) {
      test.equal(key, 'foo');
      test.equal(ttl, 60);
    });

    vat.on('ttl foo', function(ttl) {
      test.equal(ttl, 60);
    });

    vat.set('foo', 'bar');
    vat.expire('foo', 60);
    vat.ttl('foo');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `keys` method invokation': function(test) {

    var vat = EventVat();

    vat.on('keys', function(keys, regex) {
      test.deepEqual(keys, ['one', 'two']);
      test.equal(regex, r);
    });

    vat.set('foo', 'bar');
    vat.set('one', 1);
    vat.set('two', 2);

    var r = /one|two/;
    vat.keys(r);

    test.expect(2);
    vat.die();
    test.done();

  },
  'Raise event on `move` method invokation': function(test) {

    var vat = EventVat();
    var vat2 = EventVat();

    vat.on('move', function(key, db) {
      test.equal(key, 'foo');
      test.equal(db, vat2);
    });

    vat.on('move foo', function(db) {
      test.equal(db, vat2);
    });

    vat.set('foo', 'bar');
    vat.move('foo', vat2);

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise vent on `randomkey` method invokation': function(test) {

    var vat = EventVat();

    vat.on('randomkey', function(key) {
      test.ok(key === 'a' || key === 'b' || key === 'c');
    });

    vat.set('a', 1);
    vat.set('b', 2);
    vat.set('c', 3);

    vat.randomkey();

    test.expect(1);
    vat.die();
    test.done();

  },
  'Raise event on `getrange` method invokation': function(test) {

    var vat = EventVat();

    vat.on('getrange', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, 'world');
    });

    vat.on('getrange foo', function(value) {
      test.equal(value, 'world');
    });

    vat.set('foo', 'hello world!');
    vat.getrange('foo', 6, 11);

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `mget` method invokation': function(test) {

    var vat = EventVat();

    vat.on('mget', function(values) {
      test.deepEqual(values, ['hello world!', 42]);
    });

    vat.set('foo', 'hello world!');
    vat.set('bar', 42);
    vat.mget('foo', 'bar');

    test.expect(1);
    vat.die();
    test.done();

  },
  'Raise event on `mset` method invokataion': function(test) {

    var vat = EventVat();

    vat.on('mset', function(k1, v1, k2, v2, k3, v3) {
      test.equal(k1, 'a');
      test.equal(v1, 1);
      test.equal(k2, 'b');
      test.equal(v2, 2);
      test.equal(k3, 'c');
      test.equal(v3, 3);
    });

    vat.once('set', function(key, value) {
      test.equal(key, 'a');
      test.equal(value, 1);

      vat.once('set', function(key, value) {
        test.equal(key, 'b');
        test.equal(value, 2);

        vat.once('set', function(key, value) {
          test.equal(key, 'c');
          test.equal(value, 3);
        });
      });
    });

    vat.once('set a', function(value) {
      test.equal(value, 1);

      vat.once('set b', function(value) {
        test.equal(value, 2);

        vat.once('set c', function(value) {
          test.equal(value, 3);
        });
      });
    });

    vat.mset('a', 1, 'b', 2, 'c', 3);

    test.expect(15);
    vat.die();
    test.done();
  },
  'Raise event on `msetnx` method invokataion': function(test) {

    var vat = EventVat();

    vat.on('msetnx', function(k1, v1, k2, v2, k3, v3) {
      test.equal(k1, 'a');
      test.equal(v1, 1);
      test.equal(k2, 'b');
      test.equal(v2, 2);
      test.equal(k3, 'c');
      test.equal(v3, 3);
    });

    vat.msetnx('a', 1, 'b', 2, 'c', 3);

    test.expect(6);
    vat.die();
    test.done();

  },
  'Raise event on `strlen` method invokation': function(test) {

    var vat = EventVat();

    vat.on('strlen', function(key, l) {
      test.equal(key, 'foo');
      test.equal(l, 12);
    });

    vat.on('strlen foo', function(l) {
      test.equal(l, 12);
    });

    vat.set('foo', 'hello world!');
    vat.strlen('foo');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `setrange` method invokation': function(test) {

    var vat = EventVat();

    vat.on('setrange', function(key, value) {
      test.equal(key, 'foo');
      test.equal(value, 'hello redis!');
    });

    vat.on('setrange foo', function(value) {
      test.equal(value, 'hello redis!');
    });

    vat.set('foo', 'hello world!');
    vat.setrange('foo', 6, 'redis');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `hset` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hget', function(key, field, value) {
      test.equal(key, 'hash');
      test.equal(field, 'a');
      test.equal(value, 1);
    });

    vat.on('hset hash', function(field, value) {
      test.equal(field, 'a');
      test.equal(value, 1);
    });

    vat.hset('hash', 'a', 1);
    vat.hget('hash', 'a');

    test.expect(5);
    vat.die();
    test.done();

  },
  'Raise event on `hset` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hget', function(key, field, value) {
      test.equal(key, 'hash');
      test.equal(field, 'a');
      test.equal(value, 1);
    });

    vat.on('hget hash', function(field, value) {
      test.equal(field, 'a');
      test.equal(value, 1);
    });

    vat.hset('hash', 'a', 1);
    vat.hget('hash', 'a');

    test.expect(5);
    vat.die();
    test.done();

  },
  'Raise event on `hexists` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hexists', function(key, field, value) {
      test.equal(key, 'hash');
      test.equal(field, 'a');
      test.equal(value, true);
    });

    vat.on('hexists hash', function(field, value) {
      test.equal(field, 'a');
      test.equal(value, true);
    });

    vat.hset('hash', 'a', 1);
    vat.hexists('hash', 'a');

    test.expect(5);
    vat.die();
    test.done();

  },
  'Raise event on `hdel` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hdel', function(key, field) {
      test.equal(key, 'hash');
      test.equal(field, 'a');
    });

    vat.on('hdel hash', function(field) {
      test.equal(field, 'a');
    });

    vat.hset('hash', 'a', 1);
    vat.hdel('hash', 'a');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `hgetall` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hgetall', function(key, hash) {
      test.equal(key, 'bob');
      test.deepEqual(hash, { foo: 'bar', hello: 'world', answer: 42 });
    });

    vat.on('hgetall bob', function(hash) {
      test.deepEqual(hash, { foo: 'bar', hello: 'world', answer: 42 });
    });

    vat.hset('bob', 'foo', 'bar');
    vat.hset('bob', 'hello', 'world');
    vat.hset('bob', 'answer', 42);
    vat.hgetall('bob');

    test.expect(3);
    vat.die();
    test.done();
  },
  'Raise event on `hdecr` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hdecr', function(key, field, newValue) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(newValue, 1);
    });

    vat.on('hdecrby', function(key, field, value, newValue) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(value, 1);
      test.equal(newValue, 1);
    });

    vat.on('hdecr foo', function(field, newValue) {
      test.equal(field, 'a');
      test.equal(newValue, 1);
    });

    vat.on('hdecrby foo', function(field, value, newValue) {
      test.equal(field, 'a');
      test.equal(value, 1);
      test.equal(newValue, 1);
    });

    vat.hset('foo', 'a', 2);
    vat.hdecr('foo', 'a');

    test.expect(12);
    vat.die();
    test.done();

  },
  'Raise event on `hincr` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hincr', function(key, field, newValue) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(newValue, 3);
    });

    vat.on('hincrby', function(key, field, value, newValue) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(value, 1);
      test.equal(newValue, 3);
    });

    vat.on('hincr foo', function(field, newValue) {
      test.equal(field, 'a');
      test.equal(newValue, 3);
    });

    vat.on('hincrby foo', function(field, value, newValue) {
      test.equal(field, 'a');
      test.equal(value, 1);
      test.equal(newValue, 3);
    });

    vat.hset('foo', 'a', 2);
    vat.hincr('foo', 'a');

    test.expect(12);
    vat.die();
    test.done();

  },
  'Raise event on `hkeys` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hkeys', function(key, fields) {
      test.equal(key, 'foo');
      test.deepEqual(fields, ['a', 'b', 'c']);
    });

    vat.on('hkeys foo', function(fields) {
      test.deepEqual(fields, ['a', 'b', 'c']);
    });

    vat.hset('foo', 'a', 1);
    vat.hset('foo', 'b', 2);
    vat.hset('foo', 'c', 3);
    vat.hkeys('foo');

    test.expect(3);
    vat.die();
    test.done();
  },
  'Raise event on `hlen` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hlen', function(key, len) {
      test.equal(key, 'foo');
      test.equal(len, 3);
    });

    vat.on('hlen foo', function(len) {
      test.equal(len, 3);
    });

    vat.hset('foo', 'a', 1);
    vat.hset('foo', 'b', 2);
    vat.hset('foo', 'c', 3);
    vat.hlen('foo');

    test.expect(3);
    vat.die();
    test.done();
  },
  'Raise event on `hvals` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hvals', function(key, values) {
      test.equal(key, 'foo');
      test.deepEqual(values, [1, 2, 3]);
    });

    vat.on('hvals foo', function(values) {
      test.deepEqual(values, [1, 2, 3]);
    });

    vat.hset('foo', 'a', 1);
    vat.hset('foo', 'b', 2);
    vat.hset('foo', 'c', 3);
    vat.hvals('foo');

    test.expect(3);
    vat.die();
    test.done();
  },
  'Raise event on `hsetnx` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hsetnx', function(key, field, value) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(value, 42);
    });

    vat.on('hsetnx foo', function(field, value) {
      test.equal(field, 'a');
      test.equal(value, 42);
    });

    vat.hsetnx('foo', 'a', 42);
    vat.hsetnx('foo', 'a', 42);

    test.expect(5);
    vat.die();
    test.done();

  },
  'Raise event on `hmget` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hmget', function(key, values) {
      test.equal(key, 'foo');
      test.deepEqual(values, [1, 2, false]);
    });

    vat.on('hmget foo', function(values) {
      test.deepEqual(values, [1, 2, false]);
    });

    vat.hset('foo', 'a', 1);
    vat.hset('foo', 'b', 2);
    vat.hset('foo', 'c', 3);
    vat.hmget('foo', 'a', 'b', 'd');

    test.expect(3);
    vat.die();
    test.done();

  },
  'Raise event on `hmset` method invokation': function(test) {

    var vat = EventVat();

    vat.on('hmset', function(key, f1, v1, f2, v2, f3, v3) {
      test.equal(key, 'foo');
      test.equal(f1, 'a');
      test.equal(v1, 1);
      test.equal(f2, 'b');
      test.equal(v2, 2);
      test.equal(f3, 'c');
      test.equal(v3, 3);
    });

    vat.on('hmset foo', function(f1, v1, f2, v2, f3, v3) {
      test.equal(f1, 'a');
      test.equal(v1, 1);
      test.equal(f2, 'b');
      test.equal(v2, 2);
      test.equal(f3, 'c');
      test.equal(v3, 3);
    });

    vat.once('hset', function(key, field, value) {
      test.equal(key, 'foo');
      test.equal(field, 'a');
      test.equal(value, 1);

      vat.once('hset', function(key, field, value) {
        test.equal(key, 'foo');
        test.equal(field, 'b');
        test.equal(value, 2);

        vat.once('hset', function(key, field, value) {
          test.equal(key, 'foo');
          test.equal(field, 'c');
          test.equal(value, 3);
        });
      });
    });

    vat.once('hset foo', function(field, value) {
      test.equal(field, 'a');
      test.equal(value, 1);

      vat.once('hset foo', function(field, value) {
        test.equal(field, 'b');
        test.equal(value, 2);

        vat.once('hset foo', function(field, value) {
          test.equal(field, 'c');
          test.equal(value, 3);
        });
      });
    });

    vat.hmset('foo', 'a', 1, 'b', 2, 'c', 3);

    test.expect(28);
    vat.die();
    test.done();

  },

});
