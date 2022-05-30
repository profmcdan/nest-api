import { EditUserDto } from './../src/user/dto';
import { CreateUserDto, AuthDto } from './../src/auth/dto';
import * as pactum from 'pactum';
import { DbService } from '../src/db/db.service';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { AppModule } from '../src/app.module';
import { Test } from '@nestjs/testing';

describe('App e2e', () => {
  let app: INestApplication
  let prisma: DbService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule]
    }).compile();
    app = moduleRef.createNestApplication();
    app.useGlobalPipes(new ValidationPipe({
      whitelist: true
    }));
    await app.init();
    app.listen(4444);

    prisma = app.get(DbService);
    await prisma.cleanDb();
    pactum.request.setBaseUrl("http://localhost:4444/api/v1");
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const registerDto: CreateUserDto = {
      email: "john@email.com",
      password: "Password",
      firstName: "John",
      lastName: "Doe"
    };

    const loginDto: AuthDto = {
      email: "john@email.com",
      password: "Password",
    }

    describe("Register", () => {
      it("Should throw an error if email is empty", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody({
            password: registerDto.password,
            firstName: registerDto.firstName,
            lastName: registerDto.lastName
          })
          .expectStatus(400);
      });

      it("Should register", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody(registerDto)
          .expectStatus(201)
          .expectJsonLike({
            email: registerDto.email,
            lastName: registerDto.lastName 
          });
      });

      it("Should throw an error if email is taken", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .withBody(registerDto)
          .expectStatus(403);
      });

      it("Should throw an error if no body", () => {
        return pactum
          .spec()
          .post("/auth/register")
          .expectStatus(400);
      });
    });

    describe("Login", () => {
      it("Should login", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody(loginDto)
          .expectStatus(200)
          .stores("userAt", "access_token")
      });

      it("Should throw error if wrong password", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .withBody({
            email: loginDto.email,
            password: "WrongPassword"
          })
          .expectStatus(403);
      });

      it("Should throw an error if no body", () => {
        return pactum
          .spec()
          .post("/auth/login")
          .expectStatus(400);
      });
    });

  });

  describe('User', () => {
    describe("Get me", () => {
      it('should get current user', () => { 
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
       })

       it('should throw an error on current user if user not logged in', () => { 
        return pactum
          .spec()
          .get("/users/me")
          .withHeaders({
            Authorization: ""
          })
          .expectStatus(401)
       })

    });

    describe("Edit User", () => {
      it('should edit current user', () => { 
        const editUserDto: EditUserDto = {
          email: "dan@gmail.com"
        }

        return pactum
          .spec()
          .patch("/users")
          .withBody(editUserDto)
          .withHeaders({
            Authorization: "Bearer $S{userAt}"
          })
          .expectStatus(200)
          .expectBodyContains(editUserDto.email)
          .expectJsonLike({
            email: editUserDto.email
          })
       });
    });

    describe("Delete User", () => {

    });
  });

  describe('Bookmark', () => {
    describe("Create bookmark", () => {

    });

    describe("Get bookmarks", () => {

    });

    describe("Get bookmark by id", () => {

    });

    describe("Edit bookmark", () => {

    });

    describe("Delete bookmark", () => {

    });
  });
});