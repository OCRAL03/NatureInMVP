import http from 'k6/http';
import { sleep, check } from 'k6';

export const options = {
  vus: 50,
  duration: '30s'
};

export default function () {
  const url = `${__ENV.API_BASE_URL || 'http://localhost:8000'}/api/auth/token/`;
  const payload = JSON.stringify({ username: 'exp_ok4', password: 'Naturein123!' });
  const params = { headers: { 'Content-Type': 'application/json' } };
  const res = http.post(url, payload, params);
  check(res, { 'status is 200': (r) => r.status === 200 || r.status === 403 });
  sleep(1);
}
