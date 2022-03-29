import { oak } from 'root/deps.ts'

const router = new oak.Router();


router.get('/test', (ctx, next) => {
  console.log('request to test')
})

export { router }