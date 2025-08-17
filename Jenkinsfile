pipeline {
  agent any

  environment {
    AWS_ACCOUNT_ID = '695466865413'
    AWS_REGION     = 'ap-south-1'
    ECR_REPO       = 'sample-app'
    IMAGE          = "${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO}"
  }

  stages {
    stage('Checkout') {
      steps {
        git(
          url: 'https://github.com/aravinds-cyber/Newdeployment.git',
          branch: 'main',
          credentialsId: 'github-token'
        )
      }
    }

    stage('Build Docker Image') {
      steps {
        script {
          IMAGE_TAG = "${env.BUILD_NUMBER}"
          sh "docker build -t ${IMAGE}:${IMAGE_TAG} ."
        }
      }
    }

    stage('Login to ECR & Push Image') {
      steps {
        withCredentials([usernamePassword(
          credentialsId: 'aws-ecr-creds',
          usernameVariable: 'AWS_ACCESS_KEY_ID',
          passwordVariable: 'AWS_SECRET_ACCESS_KEY'
        )]) {
          sh """
            aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
            aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY

            aws ecr get-login-password --region $AWS_REGION | \
            docker login --username AWS --password-stdin $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com

            docker push ${IMAGE}:${IMAGE_TAG}
          """
        }
      }
    }

    stage('Deploy to Kubernetes (Rolling Update)') {
      steps {
        withKubeConfig(credentialsId: 'eks-kubeconfig') {
          sh """
            sed 's|IMAGE_TAG|${IMAGE_TAG}|g' k8s/deployment.yaml > k8s/deploy-gen.yaml
            kubectl apply -f k8s/deploy-gen.yaml
          """
        }
      }
    }
  }
}

