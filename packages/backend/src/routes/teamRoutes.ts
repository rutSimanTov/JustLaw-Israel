
import express from 'express';
const router = express.Router();

const teamMembers = [{
  name: "Bat-chen Schlesinger",
  title: "Founder and CEO",
  linkedinUrl: "https://www.linkedin.com/in/bat-chen-schlesinger/",
  image: "/picture/BatChenSchlesinger.jpg"
}, {
  name: "Omer Brandes",
  title: "Co-Founder",
  linkedinUrl: "https://www.linkedin.com/in/omer-brandes-adv/",
  image: "/picture/OmerBrandes.jpg"
}, {
  name: "Sue Crismon",
  title: "Partner",
  linkedinUrl: "https://www.linkedin.com/in/sue-crismon-402b1a18/",
  image: "/picture/SueCrismon.jpg"
}, {
  name: "Itai Radberg",
  title: "Marketing and Business Development Executive",
  linkedinUrl: "https://www.linkedin.com/in/itai-radberg-02a94a195/",
  image: "/picture/ItaiRadberg.jpg"
}];

router.get('/', (req, res) => {
  res.json({
    success: true,
    data: teamMembers
  });
});

export default router;
