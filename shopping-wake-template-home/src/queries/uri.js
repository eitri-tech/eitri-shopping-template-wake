export const queryUri = `query ($url: String!, $partnerAccessToken: String) {
  uri(url: $url, partnerAccessToken: $partnerAccessToken){
    kind
  }
}`
