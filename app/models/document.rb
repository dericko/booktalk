class Document < ApplicationRecord
  has_neighbors :embeddings
end
