
exports.up = function (knex, Promise) {
    return knex.schema.createTable('comments', commentsTable => {
        commentsTable.increments('comment_id').primary()
        commentsTable.string('author').notNullable();
        commentsTable.foreign('author').references('users.username')
        commentsTable.integer('article_id').notNullable();
        commentsTable.foreign('article_id').references('articles.article_id')
        commentsTable.integer('votes').defaultTo(0).notNullable();
        commentsTable.timestamp('created_at', { useTz: true }).defaultTo(knex.fn.now())
        commentsTable.text('body').notNullable();
    })
};

exports.down = function (knex, Promise) {
    return knex.schema.dropTable('comments');
};
