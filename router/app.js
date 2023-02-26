import express from "express";
import { client } from "../index.js";
const router = express.Router();

router.get("/allmentors", async function (request, response) {
  //db.movies.find({})
  const movie = await client
    .db("day-41")
    .collection("mentor")
    .find({})
    .toArray();
  response.send(movie);
});
router.get("/allstudents", async function (request, response) {
  //db.movies.find({})
  const movie = await client
    .db("day-41")
    .collection("students")
    .find({})
    .toArray();
  response.send(movie);
});
router.post("/mentor/add", express.json(), async function (request, response) {
  //db.movies.find({})
  const mentordata = request.body;
  const movie = await client
    .db("day-41")
    .collection("mentor")
    .insertMany([mentordata]);
  response.send(movie);
});
router.put("/student/add", express.json(), async function (request, response) {
  //db.movies.find({})
  const mentorname = request.params.mentorname;

  const mentordata = request.body;

  const movie = await client
    .db("day-41")
    .collection("students")
    .insertOne(mentordata);
  response.send(movie);
});
router.put(
  "/assigntomentor/:mentorname",
  express.json(),
  async function (request, response) {
    const mentorname = request.params.mentorname;
    const mentordata = request.body;
    const studentname = mentordata.map(
      async ({ student_name }) =>
        await client
          .db("day-41")
          .collection("students")
          .deleteMany({ student_name: student_name })
    );
    const obj = mentordata.map(
      async (ment) =>
        await client
          .db("day-41")
          .collection("mentor")
          .updateMany(
            { mentor_name: mentorname },
            { $push: { students: ment } }
          )
    );

    response.send(obj);
  }
);
router.get(
  "/mentorchange/:oldmentorname/:studentname/:newmentorname",
  async function (request, response) {
    const mentorname = request.params.oldmentorname;
    const studentname = request.params.studentname;
    const newmentorname = request.params.newmentorname;
    const mentordata = request.body;

    const { students } = await client
      .db("day-41")
      .collection("mentor")
      .findOne({ "students.student_name": { $eq: studentname } });
    const fgg = students.find((dd) => dd.student_name === studentname);
    const updatementordata = await client
      .db("day-41")
      .collection("mentor")
      .updateOne(
        { mentor_name: mentorname },
        { $pull: { students: { student_name: studentname } } }
      );

    const getdata = await client
      .db("day-41")
      .collection("mentor")
      .updateOne({ mentor_name: newmentorname }, { $push: { students: fgg } });

    response.send(updatementordata);
  }
);
export default router;
