import defaultResolve, {
  PublishAction,
  DiscardChangesAction,
  UnpublishAction
} from 'part:@sanity/base/document-actions'


/**
 * For product types, only allow publish, unpublish, & discard changes
 * Don't allow delete, duplicate, etc.
 */
export default function resolveDocumentActions(props) {
  const isProduct = [`baseProduct`, `variant`].includes(props.type)

  const productActions = [
    PublishAction,
    DiscardChangesAction,
    UnpublishAction
  ]

  return isProduct ? productActions : defaultResolve(props)
}
