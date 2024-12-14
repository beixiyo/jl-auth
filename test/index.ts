import { genOAuthUrl } from '@/utils'


console.log(genOAuthUrl(
  'https://www.example.com',
  {
    client_id: '2312312312315dfdasfsd',
    redirect_uri: 'https://www.example.com',
    state: 'ttse'
  }
))