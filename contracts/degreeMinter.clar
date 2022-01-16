;; nft-minting
;; <contract for minting degrees as NFTs by University>

;; ---------- Global Variables ----------

;;Principle of University, needed to check that only the university mints degrees.
(define-constant university-principal 'ST3NXW8T49WPYFX9R3XVJE748HFSGR2VT9ETSBBB5)
(define-constant university-principalalt 'ST2Q13EZ2EJYQRPMS19N5JV7SG1Q4MMDN1HVWEP9)

;; Failed to mint error
(define-constant Failed-to-mint-error (err u1) )
;;Unauthorized Principal error
(define-constant Unauthorized-principal (err u2) )


;; data maps and vars
;; Mapping data for the degree information
(define-map degree-data 
    ;; ERR: Public Data, as all maps are public
    {degree-id: uint}
    {degree-hash: (buff 32), token-uri: (string-ascii 64), gaia-link: (string-ascii 64)}
)

;; defining non-fungible token for degree, uint is the identifier type (the primary key)
(define-non-fungible-token degree-nft uint)

;; setting token-id of the NFT
(define-data-var curr-token-id uint u1)

;; ---------- private functions ----------

;; Registering the token, the new-owner will be the student to whom the degree is accredited
(define-private (register-token (new-owner principal) (token-id uint))
    (begin
      (unwrap! (nft-mint? degree-nft token-id new-owner) false)
    )
)

;;Check Owner
(define-private (is-owner (actor principal) (token-id uint))
  (is-eq actor
    (unwrap! (nft-get-owner? degree-nft token-id) false)
  )
)


;; ---------- public functions ----------

;; minting the nft on blockchain
(define-public (mint 
(owner principal)
  (degree-hash (buff 32))
  (token-uri (string-ascii 64))
  (gaia-link (string-ascii 64))
) 
    (let
        (
            (token-id (+ (var-get curr-token-id) u1))
        )

        (asserts! (or (is-eq tx-sender university-principal) (is-eq tx-sender university-principalalt)) Unauthorized-principal)
        (asserts! (register-token owner token-id) Failed-to-mint-error)
          (map-set degree-data
            {degree-id: token-id}
            {degree-hash: degree-hash, token-uri: token-uri, gaia-link: gaia-link}
          )
        (var-set curr-token-id token-id)
        (ok true)
    )
)

;; Fetch Degree-hash
(define-read-only (get-degree-hash (token-id uint))
    (unwrap-panic (get degree-hash (map-get? degree-data {degree-id: token-id})))
)

;; Fetch Gaia-Link
(define-read-only (get-gaia-link (token-id uint))
    (unwrap-panic (get gaia-link (map-get? degree-data {degree-id: token-id})))
)
