/* eslint-env jest */
'use strict'

import dotenv from 'dotenv'
import chai from 'chai'
import logger from 'winston'

import User from '../models/User'

dotenv.config()

let expect = chai.expect

describe('User model:', async function () {
  // const User = models.User
  logger.info(`Testing user model. Database ${User.getDb().url} and collection ${User.getCollectionName()}`)
  it('tests whether connection works', async function () {
    await User.find({email: 'nopestitynopes'}) // this will create the collection implicitly
    const count = await User.getDb().collection(User.getCollectionName()).count()
    expect(count).to.equal(0)
  })
  it('inserts a user into the database', async function () {
    let result = await User.insert(
      {
        email: 'example@example.com',
        firstName: 'test',
        lastName: 'test',
        registrationDate: new Date().toISOString()
      },
      {
        email: 'example@example.com',
        hash: 'test',
        salt: 'test'
      }
    )
    expect(result.email).to.equal('example@example.com')
  })
  it('inserts multiple users into the database', async function () {
    let result1 = await User.insert(
      {
        email: 'example1@example.com',
        firstName: 'test',
        lastName: 'test',
        registrationDate: new Date().toISOString()
      },
      {
        email: 'example1@example.com',
        hash: 'test',
        salt: 'test'
      }
    )
    let result2 = await User.insert(
      {
        email: 'example2@example.com',
        firstName: 'test',
        lastName: 'test',
        registrationDate: new Date().toISOString()
      },
      {
        email: 'example2@example.com',
        hash: 'test',
        salt: 'test'
      }
    )
    let result3 = await User.insert(
      {
        email: 'example3@example.com',
        firstName: 'test',
        lastName: 'test',
        registrationDate: new Date().toISOString()
      },
      {
        email: 'example3@example.com',
        hash: 'test',
        salt: 'test'
      }
    )
    expect(result1.email).to.equal('example1@example.com')
    expect(result2.email).to.equal('example2@example.com')
    expect(result3.email).to.equal('example3@example.com')
  })
  it('updates users in the database', async function () {
    let updatedCount = await User.update(
      {email: 'example1@example.com'},
      {firstName: 'Penny'},
      {
        email: 'example1@example.com',
        hash: 'test',
        salt: 'test'
      }
    )
    expect(updatedCount).to.equal(1)
    let mrNode = await User.findOne({email: 'example2@example.com'})
    expect(mrNode).not.to.equal(null)
    if (mrNode !== null) {
      mrNode.lastName = 'mrNode'
      await User.update(
        {email: 'example2@example.com'},
        mrNode,
        {
          email: 'example2@example.com',
          hash: 'test',
          salt: 'test'
        }
      )

      mrNode = (await User.find({lastName: 'mrNode'})).first()
      expect(mrNode.lastName).to.equal('mrNode')
    }

    let penny = await User.findOne({firstName: 'Penny'})
    expect(penny.firstName).to.equal('Penny')
  })
  it('finds many users from the database', async function () {
    let usersWithLasName = await User.find({lastName: { '$exists': true }})
    expect(usersWithLasName.toArray()).to.have.length(4)
  })
  it('cleans up all the users in the database', async function () {
    let allUsers = await User.find()
    expect(allUsers.toArray()).to.have.length(4)
    await User.delete({ email: 'example@example.com' }) // delete one using instance method
    let count = await User.count()
    expect(count).to.equal(3)
    let deletedCount = await User.delete({email: 'example1@example.com'})// delete a user using static method
    expect(deletedCount).to.equal(1)
    count = await User.count()
    expect(count).to.equal(2)
    await User.delete() // delete the rest
    count = await User.count()
    expect(count).to.equal(0)
    // in general you should avoid using anything database-specific outside of the models folder
    // but we are doing it for testing here, so this can be an exception
    await User.getDb().dropCollection(User.getCollectionName())
  })
})
/* Test associations between user and comment
describe('Comment', function() {
  const Comment = models.Comment;
  logger.info(`Testing comment model. Database ${Comment.DB.url} and collection ${Comment.COLLECTION}`);
  it('tests whether connection works', async function() {
    await Comment.find();
    const count = await Comment.DB.collection(Comment.COLLECTION).count();
    expect(count).to.be.a('number');
  });
  it('posts a comment as a user', async function(){

  });
  it('posts another comment as a user', async function(){

  })
  it('likes a random comment', async function(){

  })
  it('updates an existing comment', async function(){

  })
  it('cleans up all the comments in the database', async function(){

  })
});
*/
