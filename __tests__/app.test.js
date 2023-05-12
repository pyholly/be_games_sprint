const request = require("supertest");
const seed = require("../db/seeds/seed");
const app = require("../app");
const db = require("../db/connection");

const {
  categoryData,
  commentData,
  reviewData,
  userData,
} = require("../db/data/test-data/index");

beforeEach(() => {
  return seed({
    categoryData,
    commentData,
    reviewData,
    userData,
  });
});

afterAll(() => {
  db.end();
});

describe("/api/categories", () => {
  test("GET - status: 200 - respond with all the properties", () => {
    return request(app)
      .get("/api/categories")
      .expect(200)
      .then((response) => {
        expect(response.body.categories.length).toBe(4);
        response.body.categories.forEach((category) => {
          expect(typeof category.slug).toBe("string");
          expect(typeof category.description).toBe("string");
        });
      });
  });
});
describe("/api/mispelt", () => {
  test("should return 404 if incorrect url", () => {
    return request(app)
      .get("/api/categoris")
      .expect(404)
      .then((response) => {
        expect(response.body.msg).toBe("request not found");
      });
  });
});

describe("/api", () => {
  test("GET - status: 200 - respond with JSON object", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        expect(typeof response.body.object).toBe("object");
      });
  });
  test("GET - status: 200 - respond with description property", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((response) => {
        Object.values(response.body.object).forEach((obj) => {
          expect(typeof obj.description).toBe("string");
          expect(Array.isArray(obj.queries)).toBe(true);
          expect(typeof obj.exampleResponse).toBe("object");
        });
      });
  });
});

describe("/api/reviews/:review_id", () => {
  test("GET - status: 200 - respond with all the properties", () => {
    return request(app)
      .get("/api/reviews/2")
      .expect(200)
      .then((response) => {
        expect(response.body.review[0].review_id).toBe(2);
        expect(typeof response.body.review[0].review_id).toBe("number");
        expect(typeof response.body.review[0].title).toBe("string");
        expect(typeof response.body.review[0].review_body).toBe("string");
        expect(typeof response.body.review[0].designer).toBe("string");
        expect(typeof response.body.review[0].review_img_url).toBe("string");
        expect(typeof response.body.review[0].votes).toBe("number");
        expect(typeof response.body.review[0].category).toBe("string");
        expect(typeof response.body.review[0].owner).toBe("string");
        expect(typeof response.body.review[0].created_at).toBe("string");
      });
  });
  test("GET - status: 400 when client inputs a bad request", () => {
    return request(app)
      .get("/api/reviews/notAnID")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("GET - status: 404 when client inputs a valid request but the id is yet to exist", () => {
    return request(app)
      .get("/api/reviews/1000")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("No user found for Id of 1000");
      });
  });
});

describe("/api/reviews", () => {
  test("GET - status: 200 - responds with all properties", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews.length).toBe(13);
        response.body.reviews.forEach((review) => {
          expect(typeof review.owner).toBe("string");
          expect(typeof review.title).toBe("string");
          expect(typeof review.review_id).toBe("number");
          expect(typeof review.category).toBe("string");
          expect(typeof review.review_img_url).toBe("string");
          expect(typeof review.created_at).toBe("string");
          expect(typeof review.votes).toBe("number");
          expect(typeof review.designer).toBe("string");
          expect(typeof review.comment_count).toBe("string");
        });
      });
  });
  test("GET - status 200 - sorts by date DSC", () => {
    return request(app)
      .get("/api/reviews")
      .expect(200)
      .then((response) => {
        expect(response.body.reviews).toBeSortedBy("created_at", {
          descending: true,
        });
      });
  });
});

describe.only("POST /api/reviews/:review_id/comments", () => {
  test("POST - status: 201 - responds with posted comment", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "mallionaire",
        body: "Sooo much funnn!",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment.author).toBe("mallionaire");
        expect(response.body.comment.body).toBe("Sooo much funnn!");
      });
  });
  test("POST - status: 201 - responds with all properties", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "mallionaire",
        body: "Sooo much funnn!",
      })
      .expect(201)
      .then((response) => {
        expect(response.body.comment.review_id).toBe(3);
        expect(typeof response.body.comment.review_id).toBe("number");
        expect(typeof response.body.comment.author).toBe("string");
        expect(typeof response.body.comment.body).toBe("string");
        expect(typeof response.body.comment.comment_id).toBe("number");
        expect(typeof response.body.comment.votes).toBe("number");
        expect(typeof response.body.comment.created_at).toBe("string");
      });
  });
  test("POST - status: 400 when client inputs a bad request", () => {
    return request(app)
      .post("/api/reviews/notAnID/comments")
      .send({
        username: "mallionaire",
        body: "Sooo much funnn!",
      })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("bad request");
      });
  });
  test("POST - status: 404 when client inputs a valid request but id does not exist yet", () => {
    return request(app)
      .post("/api/reviews/1000/comments")
      .send({
        username: "mallionaire",
        body: "Sooo much funnn!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("id not found");
      });
  });
  test("POST - status: 404 if no username provided", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "",
        body: "Sooo much funnn!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("please provide a username");
      });
  });
  test("POST - status: 404 if invalid username provided", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "cozypanda",
        body: "Sooo much funnn!",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("please provide valid username");
      });
  });
  test("POST - status: 404 if no body provided", () => {
    return request(app)
      .post("/api/reviews/3/comments")
      .send({
        username: "mallionaire",
        body: "",
      })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("please provide a comment");
      });
  });
});
