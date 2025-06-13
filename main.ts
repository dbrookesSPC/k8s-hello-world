import { Construct } from 'constructs';
import { App, Chart } from 'cdk8s';
import { KubeDeployment, KubeService } from './imports/k8s';

export class MyChart extends Chart {
  constructor(scope: Construct, ns: string, appLabel: string) {
    super(scope,ns);

    // define resources here
    // Define a Kubernetes Deployment
    new KubeDeployment(this, 'my-deployment', {
      spec: {
        replicas: 3,
        selector: { matchLabels: { app: appLabel } },
        template: {
          metadata: { labels: { app: appLabel } },
          spec: {
            containers: [
              {
                name: 'app-container',
                image: 'nginx:1.19.10',
                ports: [{ containerPort: 80 }]
              }
            ]
          }
        }
      }
    });
    new KubeService(this, 'loadbalancer', {
  spec: {
    selector: { app: appLabel },
    ports: [{ port: 80, targetPort: { value: 80 } }],
    type: 'LoadBalancer' // or 'NodePort' for local testing
  }
});
  }
}

const app = new App();
new MyChart(app, 'k8s-hello-world', 'helloworld');
app.synth();
