export const queryHotsites = `query ($first: Int, $after: String) {
  hotsites(first: $first, after: $after) {
    edges {
      cursor
      node {
        hotsiteId
        name
        url
        subtype
        template
        startDate endDate
        expression
      }
    }
  }
}`
