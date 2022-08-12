function select(db, table) {
    return new Promise((resolve, reject) => {
        const queries = [];
        db.each(`SELECT rowid, * FROM ${table}`, (err, row) => {
            if (err) {
                reject(err); // optional: you might choose to swallow errors.
            } else {
                queries.push(row); // accumulate the data
            }
        }, (err, n) => {
            if (err) {
                reject(err); // optional: again, you might choose to swallow this error.
            } else {
                resolve(queries); // resolve the promise
            }
        });
    });
}

const mapToValue = (v) => {
    if (typeof v === 'string') {
        return `'${v}'`
    }
    return v;
}

function insert(db, table, entity) {
    return new Promise((resolve, reject) => {
        const columns = Object.keys(entity);
        const values = Object.values(entity).map(mapToValue); 
        db.exec(`INSERT INTO ${table} (${columns.join(',')}) VALUES (${values.join(',')}) `, (err, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(done);
            }
        });
    });
}

function update(db, table, entity) {
    return new Promise((resolve, reject) => {
        const updateStatements = Object.entries(entity).filter(([key]) => key.toLowerCase() != 'rowid').map(([key,value]) => `${key} = ${mapToValue(value)} `).join(',')
        const columns = Object.keys(entity);
        const values = Object.values(entity).map(v => typeof v === 'string' ? `'${v}'` : v); 
        db.exec(`UPDATE ${table} SET ${updateStatements} WHERE rowid = ${entity.rowid} `, (err, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(done);
            }
        });
    });
}

function deleteRow(db, table, entity) {
    return new Promise((resolve, reject) => {
        db.exec(`DELETE FROM ${table} WHERE rowid = ${entity.rowid}`, (err, done) => {
            if (err) {
                reject(err);
            } else {
                resolve(done);
            }
        });
    });
}

module.exports = {
	insert,
	update,
	deleteRow,
	select
}