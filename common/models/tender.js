module.exports = function(Tender) {

  Tender.remoteMethod('calendar', {
    accepts: [
      {arg: 'start', type: 'date', required: true},
      {arg: 'end', type: 'date', required: true}
    ],
    http: {path: '/calendar', verb: 'get'},
    returns: {arg: 'events', type: 'Object[]', root: true}
  });

  Tender.calendar = function(start, end, cb) {

    var filter = {
      where: {
         deadline: {
           between: [ start.toUTCString(), end.toUTCString() ]
         }
      },
      order: 'deadline'
    };

    Tender.find(filter, function(err, data){
        var tmp = (data || [] ).map(function(item){
          return {
            title: item.name,
            start: item.deadline,
            state: item.state,
            code: item.code
          }
        });

        cb(err, tmp);
      });
  }
};
