const chai = require("chai");
const chaiHttp = require("chai-http");
const status = require("http-status");
const expect = chai.expect;

const app = require("../server");
chai.use(chaiHttp);

const api = {
        signUp: "/api/auth/signup",
        signIn: "/api/auth/signin" ,
        user: "/api/users/"   
}

const testCase = {
    positive : {
        signUp: `As a User, I want to create account`,
        AdminSignUp: `As a Admin, I want to create account`,
        signIn: `As a User, I want to login`,
        AdminSignIn: `As a Admin, I want to login`,
        get: `As a User, I want to get my account`,
        getAll: `As a Admin, I want to get all account`,
        update: `As a User, I want to update my account`,
        delete: `As a Admin, I want to delete the account`,
        deleteAll: `As a Admin, I want to delete all account`,
    },
    negative: {
        invalidPassword: `As a User, I should got error when I input invalid password`,
        delete: `As a User, I should gor error when delete the account`,

    }
}

describe(`User Test`, () => {

    let user_id = "usertest";
    let email = "usertest@yahoo.com";
    let email_update = "usertestupdate@yahoo.com";
    let role = "USER";
    let admin_id = "admintest";
    let admin_email = "admintest@yahoo.com";
    let admin_role = "ADMIN";
    let password = "P@ssw0rd";
    let token;
    let admin_token;

    it(`${testCase.positive.signUp}`, done => {
        chai
            .request(app)
            .post(`${api.signUp}`)
            .send({user_id, email, password, role})
            .end((e, res) => {
            expect(res).to.have.status(status.CREATED);
            expect(res.body.user_id).to.equal(user_id);
            expect(res.body.email).to.equal(email);
            expect(res.body.role).to.equal(role);
            done();
        });
    });

    it(`${testCase.positive.AdminSignUp}`, done => {
        chai
            .request(app)
            .post(`${api.signUp}`)
            .send({user_id: admin_id, email: admin_email, password, role: admin_role})
            .end((e, res) => {
            expect(res).to.have.status(status.CREATED);
            expect(res.body.user_id).to.equal(admin_id);
            expect(res.body.email).to.equal(admin_email);
            expect(res.body.role).to.equal(admin_role);
            done();
        });
    });
    
    it(`${testCase.positive.signIn}`, done => {
        chai
            .request(app)
            .post(`${api.signIn}`)
            .send({user_id, password})
            .end((e, res) => {
            expect(res).to.have.status(status.OK);
            expect(res.body).to.have.property("accessToken");
            token = res.body.accessToken;
            done();
        });
    });

    it(`${testCase.positive.AdminSignIn}`, done => {
        chai
            .request(app)
            .post(`${api.signIn}`)
            .send({user_id: admin_id, password})
            .end((e, res) => {
            expect(res).to.have.status(status.OK);
            expect(res.body).to.have.property("accessToken");
            admin_token = res.body.accessToken;
            done();
        });
    });

    it(`${testCase.negative.invalidPassword}`, done => {
        chai
            .request(app)
            .post(`${api.signIn}`)
            .send({user_id, password: 'INVALID'})
            .end((e, res) => {
            expect(res).to.have.status(status.UNAUTHORIZED);
            done();
        });
    });

    it(`${testCase.positive.get}`, done => {
        chai
            .request(app)
            .get(`${api.user}${user_id}`)
            .set('x-access-token', token)
            .send({user_id, password})
            .end((e, res) => {
            expect(res).to.have.status(status.OK);
            expect(res.body.user_id).to.equal(user_id);
            expect(res.body.email).to.equal(email);
            expect(res.body.role).to.equal(role);
            done();
        });
    });

    it(`${testCase.positive.getAll}`, done => {
        chai
            .request(app)
            .get(`${api.user}`)
            .set('x-access-token', admin_token)
            .send({user_id: admin_id, password})
            .end((e, res) => {
            expect(res).to.have.status(status.OK);
            done();
        });
    });

    it(`${testCase.positive.update}`, done => {
        chai
            .request(app)
            .put(`${api.user}${user_id}`)
            .set('x-access-token', token)
            .send({user_id, email: email_update, password, role})
            .end((e, res) => {
            expect(res).to.have.status(status.OK);
            expect(res.body.user_id).to.equal(user_id);
            expect(res.body.email).to.equal(email_update);
            expect(res.body.role).to.equal(role);
            done();
        });
    });

    it(`${testCase.negative.delete}`, done => {
        chai
          .request(app)
          .delete(`${api.user}${user_id}`)
          .set('x-access-token', token)
          .end((e, res) => {
            expect(res).to.have.status(status.FORBIDDEN);
            done();
        });
    });

    it(`${testCase.positive.delete}`, done => {
        chai
          .request(app)
          .delete(`${api.user}${user_id}`)
          .set('x-access-token', admin_token)
          .end((e, res) => {
            expect(res).to.have.status(status.OK);
            done();
        });
    });

    it(`${testCase.positive.deleteAll}`, done => {
        chai
          .request(app)
          .delete(`${api.user}`)
          .set('x-access-token', admin_token)
          .end((e, res) => {
            expect(res).to.have.status(status.OK);
            done();
        });
    });

});