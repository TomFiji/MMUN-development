import { ProjectModel } from '../interfaces/project.model';

const title = [
  'Community Gard',
  'Kids Support',
  'Savior of the ice',
  'Plant trees',
  'Clean Air',
  'Food Supply',
  'Free Education',
  'Equal Pay',
  'Public Health',
  'Save the whales',
  'Team sea',
];

const subTitle = [
  'Let build together',
  'One step at a time',
  'Future starts now',
  'Save the planet',
  'We have only one planet',
  'Education is a right',
  'We can end world hunger',
  'We can do it together',
  'Show your support',
];

const country = [
  'canada',
  'usa',
  'japan',
  'italy',
  'france',
  'china',
  'albania',
];

const name = ['Jake', 'Sam', 'Alex', 'Annie', 'Tom', 'Elena', 'Bob'];

const generateProjectCard = async () => {
  const images = []
  while (images.length < 3) {
    try {
      const img =  `https://picsum.photos/id/${Math.floor(
        Math.random() * 1000
      )}/200/300.webp`
      const res = await fetch(img)
      if (res.status === 200) {
        images.push(img)
      }
    } catch (error) {
    }
  }
  const project = {
    title: title[Math.floor(Math.random() * 10)],
    subtitle: subTitle[Math.floor(Math.random() * 8)],
    images,
    description:
      'In esse excepteur sunt cillum minim voluptate. Labore culpa nisi elit amet. Elit magna ad sunt ea fugiat. In esse excepteur sunt cillum minim voluptate. Labore culpa nisi elit amet. Elit magna ad sunt ea fugiat. In esse excepteur sunt cillum minim voluptate. Labore culpa nisi elit amet. Elit magna ad sunt ea fugiat.',
    abstract:
      'Consequat ut consectetur id adipisicing ex fugiat mollit ea ex incididunt.',
    impactStatement: 'Ea aliquip ipsum occaecat id commodo est veniam.',
    sdg: [Math.floor(Math.random() * 17) + 1, Math.floor(Math.random() * 17) + 1],
    country: country[Math.floor(Math.random() * 6)],
    openDate: new Date(),
    closeDate: new Date(Date.now() + 3000000000),
    isSponsored: (Math.floor(Math.random() * 3) + 1) % 2 === 0,
  };
  return project;
};

export const getProjects = async () => {
  const projectData = [];
  for (let index = 0; index < 60; index++) {
    const proj = await generateProjectCard()
    projectData.push(proj);
  }
  return projectData
}

/**
    const projects = await getProjects()
    const length = projects.length
    let counter = 0
    const uploadProject = () => {
      console.log('created project: ' + counter);
      this.createProject(projects[counter])
      if (counter + 1 < length) {
        counter++
        setTimeout(uploadProject, 700)
      }
    }
    setTimeout(() => {
      this.toastService.showToast({
        message: 'starting upload',
        style: ToastStyle.SUCCESS,
      });
      uploadProject()
    }, 5000)
 */

export default [];
