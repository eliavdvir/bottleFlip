// Classes
class Bottle {
  constructor() {
    this.bottleContainer = document.createElement("div")
    this.bottleContainer.classList.add("bottle-container")
    this.img = document.createElement("img")
    this.maxHp = 10
    this.hp = 10
    this.img.src = "https://i.imgur.com/Og88sMT.png"
    this.bottleContainer.appendChild(this.img)
    container.appendChild(this.bottleContainer)
    this.unhitable = false
    this.img.className = "bottle"
    this.damage = 1
    this.mouseMoveHandler = (event) => {
      const rect = this.img.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let angle =
        Math.atan2(event.clientY - centerY, event.clientX - centerX) +
        Math.PI / 2
      this.img.style.transform = `rotate(${angle}rad)`
    }
    document.addEventListener("mousemove", this.mouseMoveHandler)
  }
  checkHp(damage) {
    if (this.hp > 0) {
      for (let i = 0; i < damage; i++) {
        hpImgArray[hpImgIteration].src = greyHpImg
        hpTableSet = false
        hpImgIteration++
      }
    }
    if (this.hp <= 0) {
      for (let i = 0; i < hpImgArray.length; i++) {
        hpImgArray[i].src = greyHpImg
      }
      gameOver()
      return true
    } else {
      return false
    }
  }
}

class Shot {
  constructor(name, damage, range, maxShots) {
    this.name = name
    this.damage = damage
    this.range = range
    this.maxShots = maxShots
    this.isInTransition = false

    this.element = document.createElement("img")
    this.element.src = shotsSRC
    this.element.className = "shot"
    container.appendChild(this.element)

    // Add event listener to the container element
  }

  move(event) {
    if (this.isInTransition) {
      return
    }
    this.element.style.display = "block"
    this.element.style.visibility = "hidden"
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.element.style.visibility = "visible"
      })
    })
    // Calculate the position of the click relative to the center of the container
    let centerX = container.offsetWidth / 2
    let centerY = container.offsetHeight / 2
    let deltaX = event.clientX - centerX
    let deltaY = event.clientY - centerY

    // Calculate the angle of the click relative to the center of the container
    let angle = Math.atan2(deltaY, deltaX)

    // Calculate the distance from the center of the container to the edge of the screen
    let distance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2))

    // Calculate the velocity required to reach the final position in one second
    let velocity = distance

    // Calculate the final position of the box based on the angle and distance
    let finalX = centerX + Math.cos(angle) * distance
    let finalY = centerY + Math.sin(angle) * distance

    // Animate the box to move to the final position at a consistent speed
    this.isInTransition = true
    gameStats.gameTotalShots++
    this.element.style.transition = "all 0.5s"
    this.element.style.transform =
      "translate(" + (finalX - centerX) + "px, " + (finalY - centerY) + "px)"
    this.element.style.transitionTimingFunction = "linear"

    // Reset the div back to its initial position after transition is done
    setTimeout(() => {
      if (this.isInTransition == true) {
        this.isInTransition = false
        this.element.style.backgroundColor = "transparent"
        this.element.style.transition = "none"
        this.element.style.transform = "translate(0, 0)"
        this.element.style.display = "none"
      }
    }, 500)
  }
  onCollision(otherObject) {
    this.isInTransition = false
    this.element.style.backgroundColor = "transparent"
    this.element.style.transition = "none"
    this.element.style.transform = "translate(0, 0)"
    this.element.style.display = "none"
  }
}

class Enemy {
  constructor() {
    this.element = document.createElement("img")
    container.appendChild(this.element)
  }

  checkCollision(shots, specialElement = null) {
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i]
      if (specialElement) {
        if (bossArray[0].isCollidedWith(shot, specialElement)) {
          if (specialElement.parentNode === document.body) {
            document.body.removeChild(specialElement)
            gameStats.gameTotalHits++
          }

          shot.onCollision()
        }
      } else if (this.isCollidedWith(shot)) {
        this.onCollision(shot)
        shot.onCollision(this)
      }
    }
  }

  isCollidedWith(otherObject, specialElement = null) {
    if (specialElement) {
      const rect1 = specialElement.getBoundingClientRect()
      const rect2 = otherObject.element.getBoundingClientRect()

      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      )
    } else {
      const rect1 = this.element.getBoundingClientRect()
      const rect2 = otherObject.element.getBoundingClientRect()

      return !(
        rect1.right < rect2.left ||
        rect1.left > rect2.right ||
        rect1.bottom < rect2.top ||
        rect1.top > rect2.bottom
      )
    }
  }

  onCollision(otherObject) {
    // Called speretaly for each enemy
  }
}

class Demon extends Enemy {
  constructor() {
    super()
    this.element.src = "https://i.ibb.co/Lgrs4Hc/Group-1.png"
    this.element.style.width = "5vmin"
    this.element.style.height = "5vmin"
    this.maxHp = 1
    this.hp = 1
    this.damage = 1
    this.unhitable
    this.firstAnimationRan = false
    this.demonMovementAnimation() // Position the Demon in a random place and animate
  }

  demonMovementAnimation() {
    this.element.style.animationPlayState = "paused"
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
    this.element.classList = ""
    this.element.style.position = "absolute"
    this.element.style.opacity = "0"

    const randomOption = Math.floor(Math.random() * 4)
    this.element.style.removeProperty("top")
    this.element.style.removeProperty("bottom")
    this.element.style.removeProperty("right")
    this.element.style.removeProperty("left")
    let delay
    if (this.firstAnimationRan) {
      delay = Math.floor(Math.random() * 2501) + 750
    } else {
      delay = 0
    }
    this.firstAnimationRan = true
    // Set the position of the div based on the new random option
    switch (randomOption) {
      case 0:
        // Random top with 0 left
        const randomPosition =
          positionsTopRandomToLeft[
            Math.floor(Math.random() * positionsTopRandomToLeft.length)
          ]
        this.element.style.left = 0 + "px"
        this.element.style.top = randomPosition.top + "px"

        setTimeout(() => {
          this.unhitable = false
          if (gameIsPaused) {
            pausedCases.push(this)
          } else {
            this.element.style.opacity = "1"
            this.element.className = "enemy1"
          }
        }, delay)
        break
      case 1:
        // Random top with 0 right
        const randomPosition4 =
          positionsTopRandomToRight[
            Math.floor(Math.random() * positionsTopRandomToRight.length)
          ]
        this.element.style.right = 0 + "px"
        this.element.style.top = randomPosition4.top + "px"
        this.element.style.removeProperty("bottom")
        this.element.style.removeProperty("left")
        setTimeout(() => {
          this.unhitable = false
          if (gameIsPaused) {
            pausedCases.push(this)
          } else {
            this.element.style.opacity = "1"
            this.element.className = "enemy3"
          }
        }, delay)
        break
      case 2:
        // Random left with 0 top
        const randomPosition3 =
          positionsLeftRandomToTop[
            Math.floor(Math.random() * positionsLeftRandomToTop.length)
          ]
        this.element.style.top = 0 + "px"
        this.element.style.left = randomPosition3.left + "px"
        this.element.style.removeProperty("bottom")
        this.element.style.removeProperty("right")
        setTimeout(() => {
          this.unhitable = false
          if (gameIsPaused) {
            pausedCases.push(this)
          } else {
            this.element.style.opacity = "1"
            this.element.className = "enemy1"
          }
        }, delay)
        break
      case 3:
        // Random left with 0 bottom
        const randomPosition2 =
          positionsLeftRandomToBottom[
            Math.floor(Math.random() * positionsLeftRandomToBottom.length)
          ]
        this.element.style.bottom = 0 + "px"
        this.element.style.left = randomPosition2.left + "px"
        this.element.style.removeProperty("top")
        this.element.style.removeProperty("right")
        setTimeout(() => {
          this.unhitable = false
          if (gameIsPaused) {
            pausedCases.push(this)
          } else {
            this.element.style.opacity = "1"
            this.element.className = "enemy2"
          }
        }, delay)
        break
    }
  }

  onCollision(otherObject) {
    if (
      this.element.style.animationPlayState === "paused" ||
      this.element.style.animation === "none" ||
      this.unhitable == true
    ) {
      return
    }
    if (!bottleFlipBeingUsed) {
      gameStats.gameTotalHits++
    }
    this.unhitable = true
    score = score + 10
    this.demonDeathAnimation()
    setTimeout(() => {
      this.demonMovementAnimation()
    }, 300)
  }

  onBottleTouch() {
    if (bottle.unhitable == false) {
      bottle.hp = bottle.hp - this.damage
      let isDead = bottle.checkHp(this.damage)
      if (isDead) {
        return
      }
    }
    this.demonMovementAnimation() // Respawn
  }

  demonDeathAnimation() {
    gameStats.gameTotalElims++
    const rect = this.element.getBoundingClientRect()
    this.element.style.left = `${rect.left}px`
    this.element.style.top = `${rect.top}px`
    this.element.style.animation = null
    this.element.classList = ""
    this.element.classList.add("demon-fade")
    setTimeout(() => {
      this.element.classList.remove("demon-fade")
    }, 300)
  }
}

class Witch extends Enemy {
  constructor() {
    super()
    this.element.style.position = "absolute"
    this.element.src = "https://i.ibb.co/JmtZdJD/witch.png"
    this.element.style.zIndex = "5"
    this.element.style.width = "10.5vmin"
    this.element.style.height = "10.5vmin"
    this.maxHp = 10
    this.hp = 10
    this.unhitable = false
    this.damage = 1
    this.animationPaused = false // track if animation is paused
    this.pausedPosition = "10%" // save the position when animation is paused
    this.randomOption = 0
    this.witchAttackInterval
    this.witchIsAlive = true
    this.witchRespawnInterval
    this.shootAnimationCancelled = false
    this.realAttackInterval
    this.attackFRdelay = 3001
    this.attackDelay = 6500
    this.delay = Math.floor(Math.random() * 7500) + witchRespawnDelaytime

    // Decide Witch side on screen: 1 = right, 2 = left
    if (witchOnRight == false && witchOnLeft == true) {
      this.randomOption = 1
    } else if (witchOnRight == true && witchOnLeft == false) {
      this.randomOption = 2
    } else if (witchOnRight == false && witchOnLeft == false) {
      this.randomOption = Math.random() < 0.5 ? 1 : 2
    }

    this.witchEntranceAnimation() // call witch entrance animation function
    this.witchDefaultMovementAnimation() // call witch movement animation function

    // Set Witch shooting mechanism
    this.witchAttackInterval = setInterval(() => {
      if (this.witchIsAlive == false || gameIsOver == true) {
        clearInterval(this.witchAttackInterval)
        return
      } else if (gameIsPaused) {
        return
      } else {
        this.witchAttack()
      }
    }, this.attackDelay)
  }

  witchEntranceAnimation() {
    let animationName
    let direction
    let animationAlreadyCreated
    if (this.randomOption === 1) {
      // if right side Witch
      witchOnRight = true
      direction = "right"
      animationName = "moveObject"
      this.element.src = "https://i.ibb.co/Fsrcbmt/witch-Right.png"
      if (!rightWitchAnimationCreated) {
        animationAlreadyCreated = false
      }
    } else if (this.randomOption === 2) {
      // if left side Witch
      witchOnLeft = true
      direction = "left"
      animationName = "moveObject2"
      this.element.src = "https://i.ibb.co/JmtZdJD/witch.png"
      if (!leftWitchAnimationCreated) {
        animationAlreadyCreated = false
      }
    }
    // Set Witch animation Positions
    this.element.style.top = "10%"
    const keyframes = [
      { direction: "-5%", top: "10%" },
      { direction: "0%", top: "10%" },
      { direction: "2.5%", top: "15%" },
      { direction: "5%", top: "10%" },
      { direction: "7.5%", top: "15%" },
      { direction: "10%", top: "11.5%" },
    ]
    // Set animation Properties and append the animation to Element
    const animationDuration = 2000
    const animationTimingFunction = "linear"
    const animationIterationCount = "1"
    const cssAnimation = `${animationName} ${animationDuration}ms ${animationTimingFunction} ${animationIterationCount} forwards`
    this.element.style.animation = cssAnimation

    // Append animation into CSS style
    if (!animationAlreadyCreated) {
      // Check if we already appended into CSS
      const animation = `
      @keyframes ${animationName} {
        0% { ${direction}: -5%; top: ${keyframes[0].top}; }
        12% { ${direction}: 0%; top: ${keyframes[1].top}; }
        33% { ${direction}: 2.5%; top: ${keyframes[2].top}; }
        52% { ${direction}: 5%; top: ${keyframes[3].top}; }
        71% { ${direction}: 7.5%; top: ${keyframes[4].top}; }
        90% { ${direction}: 10%; top: ${keyframes[5].top}; }
        100% { ${direction}: 10%; top: ${keyframes[1].top}; }
      }
    `
      const styleElement = document.createElement("style")
      styleElement.appendChild(document.createTextNode(animation))
      document.head.appendChild(styleElement)

      if (this.randomOption === 1) {
        rightWitchAnimationCreated = true
      } else if (this.randomOption === 2) {
        leftWitchAnimationCreated = true
      }
    }
  }
  witchDefaultMovementAnimation() {
    this.unhitable = false
    let defaultAnimationAlreadyCreated
    let direction
    let defaultAnimationName
    setTimeout(() => {
      // After Entrance Animation done, insert Default Movement Animation
      const interval = Math.floor(Math.random() * 3000) + 3000
      if (this.randomOption === 1) {
        // if Right side Witch
        defaultAnimationName = "witchMove"
        direction = "right"
        this.element.style.animation = `${defaultAnimationName} ${interval}ms ease-in-out infinite alternate`
        if (!rightWitchDefaultAnimationCreated) {
          defaultAnimationAlreadyCreated = false
        }
      } else if (this.randomOption === 2) {
        // if Left side Witch
        defaultAnimationName = "witchMove2"
        direction = "left"
        this.element.style.animation = `${defaultAnimationName} ${interval}ms ease-in-out infinite alternate`
        if (!leftWitchDefaultAnimationCreated) {
          defaultAnimationAlreadyCreated = false
        }
      }

      if (this.animationPaused) {
        this.element.style.animationPlayState = "paused"
      }

      // Add the CSS animation keyframes if it wasnt added already:
      if (!defaultAnimationAlreadyCreated) {
        const styleSheet = document.styleSheets[1]
        styleSheet.insertRule(`
            @keyframes ${defaultAnimationName} {
              0% {
                top: 10%;
                ${direction}: 10%;
              }
              100% {
                top: 80%;
                ${direction}: 10%;
              }
            }
          `)
        if (this.randomOption === 1) {
          rightWitchDefaultAnimationCreated = true
        } else if (this.randomOption === 2) {
          leftWitchDefaultAnimationCreated = true
        }
      }
    }, 2001)
  }

  pauseAnimation() {
    if (this.witchIsAlive) {
      if (!this.animationPaused) {
        const style = window.getComputedStyle(this.element)
        const animation = style.getPropertyValue("animation")
        this.pausedPosition = style.getPropertyValue("top")
        this.element.style.animation = "none" // stop the animation
        this.element.style.top = this.pausedPosition
        if (this.randomOption == 1) {
          this.element.style.right = "10%"
        } else {
          this.element.style.left = "10%"
        }
        this.animationPaused = true
      }
    }
  }
  continueAnimation() {
    if (this.animationPaused) {
      const interval = Math.floor(Math.random() * 3000) + 3000
      this.element.style.top = this.pausedPosition
      if (this.randomOption == 1) {
        this.element.style.animation = `witchMove ${interval}ms ease-in-out infinite alternate`
      } else {
        this.element.style.animation = `witchMove2 ${interval}ms ease-in-out infinite alternate`
      }
      this.animationPaused = false
    }
  }

  witchAttack() {
    if (
      this.witchIsAlive == false ||
      gameIsOver == true ||
      witches.length < 1
    ) {
      clearInterval(this.witchAttackInterval)
      return
    }
    this.shootAnimationCancelled = false
    this.element.classList.add("witch-charge")
    this.realAttackInterval = setTimeout(() => {
      if (this.witchIsAlive == false || gameIsOver == true) {
        clearTimeout(this.realAttackInterval)
        return
      } else if (gameIsPaused) {
        return
      } else {
        this.witchAttackFR()
      }
    }, this.attackFRdelay)
  }

  witchAttackFR() {
    if (
      gameIsPaused == true ||
      gameIsOver == true ||
      this.witchIsAlive == false
    ) {
      this.attackFRdelay = 3001
      return
    }
    if (this.shootAnimationCancelled) {
      return
    } else {
      this.element.classList.remove("witch-charge")
      // Create a new element for the witch's shot:
      let witchShot = document.createElement("img")
      witchShot.classList.add("witchShot")
      witchShot.src = "https://i.ibb.co/hy0rJts/fireball.png"
      witchShot.style.position = "absolute"

      // Set the top style of the witch's shot to match the current top style of the Witch element:
      const style = window.getComputedStyle(this.element)
      const witchTop = style.getPropertyValue("top")
      witchShot.style.top = witchTop
      const theDamage = this.damage
      // Check if a Right or Left witch:
      if (this.randomOption === 1) {
        // randomOption "1" = right witch
        witchShot.src = "https://i.ibb.co/PjwQZjc/fireballright.png"
        const witchRight = style.getPropertyValue("right")
        witchShot.style.right = witchRight
        witchShot.style.animation = "moveShotRight 1s linear forwards"
        witchShot.addEventListener(
          "animationend",
          function witchShotAnimationEndHandler() {
            witchShot.animationEndHandler = witchShotAnimationEndHandler
            if (bottle.unhitable == false) {
              bottle.hp = bottle.hp - theDamage
              bottle.checkHp(theDamage)
            }
            witchShot.style.animation = ""
            witchShot.classList = ""
            witchShot.removeEventListener(
              "animationend",
              witchShotAnimationEndHandler
            )
            witchShot.remove()
          }
        )
      } else if (this.randomOption === 2) {
        // randomOption "2"" = left witch
        const witchLeft = style.getPropertyValue("left")
        witchShot.style.left = witchLeft
        witchShot.style.animation = "moveShotLeft 1s linear forwards"
        witchShot.addEventListener(
          "animationend",
          function witchShotAnimationEndHandler() {
            witchShot.animationEndHandler = witchShotAnimationEndHandler
            if (bottle.unhitable == false) {
              bottle.hp = bottle.hp - theDamage
              bottle.checkHp(theDamage)
            }
            witchShot.style.animation = ""
            witchShot.classList = ""
            witchShot.removeEventListener(
              "animationend",
              witchShotAnimationEndHandler
            )
            witchShot.remove()
          }
        )
      }

      // Add the witch's shot element to the game board:
      container.appendChild(witchShot)
      witchShotArray.push(witchShot)
      witchShot.witch = this
    }
  }
  witchShotAnimationEndHandler() {}
  remove() {
    clearInterval(this.realAttackInterval)
    clearInterval(this.witchAttackInterval)
    this.element.remove()

    // Iterate through witchShotArray and remove fireballs associated with this witch
    for (let i = witchShotArray.length - 1; i >= 0; i--) {
      if (witchShotArray[i].witch === this) {
        witchShotArray[i].style.animation = "" // Remove animation
        witchShotArray[i].classList = "" // Reset class list
        witchShotArray[i].removeEventListener(
          "animationend",
          witchShotArray[i].animationEndHandler
        ) // Remove the event listener
        witchShotArray[i].remove() // Remove the fireball element
        witchShotArray.splice(i, 1) // Remove the fireball from the array
      }
    }
  }

  onCollision() {
    if (this.witchIsAlive == true && this.unhitable == false) {
      // if witch isnt Alive now, we do nothing.
      if (bottleFlipBeingUsed) {
        this.witchDeathMechanics()
        return
      }
      gameStats.gameTotalHits++
      this.hp = this.hp - bottle.damage
      this.shootAnimationCancelled = true
      this.element.classList.remove("witch-charge")
      if (this.hp <= 0) {
        // if hp is greater than 0, we stop the function here. else, implement witch-death mechanics
        this.witchDeathMechanics()
      }
    }
  }

  witchDeathMechanics() {
    this.unhitable = true
    score = score + 50
    this.witchIsAlive = false
    this.witchDeathAnimation()
    setTimeout(() => {
      this.hp = this.maxHp
      this.element.style.animation = ""
      this.element.style.top = "10%"
      if (this.randomOption == 1) {
        this.element.style.removeProperty("left")
        this.element.style.right = "-10%"
      } else {
        this.element.style.removeProperty("right")
        this.element.style.left = "-10%"
      }
      this.witchRespawnInterval = setInterval(() => {
        //    witchRespawnInterval will only run one time and recreate the witch, but if game is paused atm,
        if (gameIsPaused) {
          //    the interval will restart itself before recreating the witch, until game isnt paused.
          this.delay = 5000 // retry in 5 sec to check if game still paused.
          return
        } else {
          clearInterval(this.witchRespawnInterval)
        }
        this.witchIsAlive = true
        // Witch entrance & movement animation functions:
        this.witchEntranceAnimation()
        this.witchDefaultMovementAnimation()

        this.witchAttackInterval = setInterval(() => {
          if (this.witchIsAlive == false || gameIsOver == true) {
            clearInterval(this.witchAttackInterval)
            return
          } else if (gameIsPaused) {
            return
          } else {
            this.witchAttack()
          }
        }, this.attackDelay)

        this.delay = Math.floor(Math.random() * 7500) + witchRespawnDelaytime
      }, this.delay)
    }, 751)
  }
  witchDeathAnimation() {
    gameStats.gameTotalElims++
    const rect = this.element.getBoundingClientRect()
    this.element.style.removeProperty("right")
    this.element.style.left = `${rect.left}px`
    this.element.style.top = `${rect.top}px`
    this.element.style.animation = null
    this.element.classList = ""
    this.element.classList.add("witch-fade")
    setTimeout(() => {
      this.element.classList.remove("witch-fade")
    }, 750)
  }
}
class Meteor extends Enemy {
  constructor(image) {
    super()
    this.element.src = image.src
    this.element.style.position = "absolute"
    this.element.style.width = "12vmin"
    this.element.style.height = "12vmin"
    this.element.style.zIndex = "5"
    this.maxHp = 6
    this.hp = 6
    this.damage = 2
    this.unhitable
    this.meteorRespawnInterval
    this.respawnDelay
    this.meteorMovementAnimation() // Position the Meteor in a random place with 0left0right and animate to player
  }

  meteorMovementAnimation() {
    this.unhitable = false
    const randomOption = Math.floor(Math.random() * 2)
    switch (randomOption) {
      case 0:
        // Random top with 0 left
        const randomPosition =
          positionsTopRandomToLeft[
            Math.floor(Math.random() * positionsTopRandomToLeft.length)
          ]
        this.element.style.left = -50 + "px"
        this.element.style.top = randomPosition.top + "px"
        this.element.classList.add("meteor1")
        break
      case 1:
        // Random top with 0 right
        const randomPosition2 =
          positionsTopRandomToRight[
            Math.floor(Math.random() * positionsTopRandomToRight.length)
          ]
        this.element.style.right = -50 + "px"
        this.element.style.top = randomPosition2.top + "px"
        this.element.classList.add("meteor2")
        break
    }
  }

  onCollision(otherObject) {
    if (
      this.element.style.animationPlayState === "paused" ||
      this.element.style.animation === "none" ||
      this.unhitable == true
    ) {
      return
    }
    gameStats.gameTotalHits++
    this.hp = this.hp - bottle.damage
    if (this.hp <= 0) {
      this.unhitable = true
      this.meteorDeathAnimation()
      setTimeout(() => {
        this.element.style.animationPlayState = "paused"
        this.element.style.animation = "none" // reset the animation
        this.element.style.animation = null
        this.element.classList = ""
        this.element.style.removeProperty("bottom")
        this.element.style.removeProperty("left")
        this.element.style.removeProperty("right")
        this.element.style.removeProperty("top")

        this.element.style.right = "-250px"
        this.respawnDelay = 12500

        const respawnCallback = () => {
          if (gameIsPaused) {
            setTimeout(respawnCallback, 5000) // Check again in 5 seconds
            return
          } else if (gameIsOver) {
            return // Do nothing if the game is over
          } else {
            this.hp = this.maxHp
            this.meteorMovementAnimation() // Call the function if the game is not paused or over
          }
        }

        setTimeout(respawnCallback, this.respawnDelay)
      }, 300)

      score = score + 100
    }
  }

  onBottleTouch() {
    if (bottle.unhitable == false) {
      bottle.hp = bottle.hp - this.damage
      let isDead = bottle.checkHp(this.damage)
      if (isDead) {
        return
      }
    }
    this.element.style.animationPlayState = "paused"
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
    this.element.classList = ""
    this.element.style.removeProperty("bottom")
    this.element.style.removeProperty("left")
    this.element.style.removeProperty("right")
    this.element.style.removeProperty("top")

    this.element.style.right = "-250px"
    this.respawnDelay = 12500

    const respawnCallback = () => {
      if (gameIsPaused) {
        setTimeout(respawnCallback, 5000) // Check again in 5 seconds
        return
      } else if (gameIsOver) {
        return // Do nothing if the game is over
      } else {
        this.hp = this.maxHp
        this.meteorMovementAnimation() // Call the function if the game is not paused or over
      }
    }

    setTimeout(respawnCallback, this.respawnDelay)
  }
  meteorDeathAnimation() {
    gameStats.gameTotalElims++
    const rect = this.element.getBoundingClientRect()
    this.element.style.left = `${rect.left}px`
    this.element.style.top = `${rect.top}px`
    this.element.style.animation = null
    this.element.classList = ""
    this.element.classList.add("meteor-fade")
    setTimeout(() => {
      this.element.classList.remove("meteor-fade")
    }, 300)
  }
}
class firstBoss extends Enemy {
  constructor() {
    super()
    this.element.src = "https://i.ibb.co/4gGNrZY/first-Boss.png"
    this.element.style.zIndex = "5"
    this.teleportDoor = document.createElement("img")
    this.teleportDoor.src = "https://i.ibb.co/C0CtHMF/portal.png"
    this.teleportDoor.style.visibility = "hidden"
    this.teleportDoor.style.position = "absolute"
    this.teleportDoor.style.width = "35vmin"
    this.teleportDoor.style.height = "41vmin"
    this.teleportDoor.style.top = "-401px"
    container.appendChild(this.teleportDoor)
    this.element.style.position = "absolute"
    this.element.style.width = "34vmin"
    this.element.style.height = "34vmin"
    this.element.style.top = "10%"
    this.element.style.left = "9%"
    this.teleportSecondInterval
    this.maxHp = 50
    this.unhitable = true
    this.hp = 50
    this.damage = 1
    this.onLeftSide = false
    this.threeShotsChargeActive = false
    this.teleportInterval
    this.laserBeamInterval
    this.threeShotsAttackInterval
    this.attackPatternActive = false
    this.attackPatternTimeout
    this.isDying = false
    this.gameWasPaused = false
    this.imageSources = [
      "https://i.ibb.co/4gGNrZY/first-Boss.png", // 1st frame wings
      "https://i.ibb.co/RT1ZHwF/first-Boss2ndframe.png", // 2nd frame wings
      "https://i.ibb.co/FJ01VJv/first-Boss3-Shots-Animation.png", // 3ShotsAttack 1st frame
      "https://i.ibb.co/25Bny53/first-Boss3-Shots-Animation2.png", // 3ShotsAttack 2nd frame
      "https://i.ibb.co/nj4n8TF/first-Boss-Death.png", // Boss Death
    ]
    this.preloadedImages = this.imageSources.map((src) => {
      const img = new Image()
      img.src = src
      return img
    })
    this.currentIndex = 0
    this.moveWings()
    this.bossEntranceAnimation()
  }

  bossEntranceAnimation() {
    if (gameIsPaused) {
      setTimeout(() => {
        this.bossEntranceAnimation()
      }, 3000)
      return
    }
    shakeScreen(5, 2000)
    // BOSS ENTRANCE ANIMATION
    const animationName = "moveBoss"
    const keyframes = [
      { left: "100%", top: "30%" }, // spawn position
      { left: "80%", top: "5%" }, // move to 2.5% from top and 15% from right
      { left: "60%", top: "65%" }, // move to 5% from top and 40% from right
      { left: "25%", top: "55%" }, // move to 10% from top and 65% from right
      { left: "15%", top: "35%" }, // move to 80% from right and 25% from top
      { left: "9%", top: "10%" }, // move to 9% from left and 10% from top
    ]

    const animationDuration = 6000
    const animationTimingFunction = "linear"
    const animationIterationCount = "1"
    const cssAnimation = `${animationName} ${animationDuration}ms ${animationTimingFunction} ${animationIterationCount} forwards`
    this.element.style.animation = cssAnimation

    const animation = `
        @keyframes ${animationName} {
          0% { left: 100%; top: ${keyframes[0].top}; }
          12% { left: ${keyframes[1].left}; top: ${keyframes[1].top}; }
          33% { left: ${keyframes[2].left}; top: ${keyframes[2].top}; }
          52% { left: ${keyframes[3].left}; top: ${keyframes[3].top}; }
          71% { left: ${keyframes[4].left}; top: ${keyframes[4].top}; }
          90% { left: ${keyframes[5].left}; top: ${keyframes[5].top}; }
          100% { left: ${keyframes[5].left}; top: ${keyframes[5].top}; }
        }
      `
    const styleElement = document.createElement("style")
    styleElement.appendChild(document.createTextNode(animation))
    document.head.appendChild(styleElement)

    setTimeout(() => {
      if (this.attackPatternActive == false) {
        this.attackPattern()
      }
      if (this.gameWasPaused == false) {
        this.leftSideAnimation()
      }
    }, 6001)
  }

  moveWings() {
    if (this.isDying) {
      return
    }
    setTimeout(() => {
      this.moveWings()
    }, 200)
    if (gameIsPaused) {
      return
    }

    if (this.threeShotsChargeActive) {
      // If threeShotsChargeActive is true, alternate between the 3rd and 4th images
      this.currentIndex = this.currentIndex === 2 ? 3 : 2
    } else {
      // If threeShotsChargeActive is false, alternate between the 1st and 2nd images
      this.currentIndex = this.currentIndex === 0 ? 1 : 0
    }
    this.element.src = this.preloadedImages[this.currentIndex].src
  }
  leftSideAnimation() {
    this.unhitable = false
    this.onLeftSide = true
    this.element.style.animationPlayState = "paused"
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
    this.element.style.removeProperty("right")
    this.element.style.visibility = "visible"
    this.element.style.left = "9%"
    this.element.style.animation = `bossMove ${4000}ms cubic-bezier(0.42, 0, 0.58, 1) infinite alternate`

    // Add the CSS animation keyframes:
    if (!bossMoveKeyframesAdded) {
      const styleSheet = document.styleSheets[1]
      styleSheet.insertRule(`
      @keyframes bossMove {
        0% {  
          top: 10%;
          left: 9%;
        }

        25% {
          top: 60%;
          left: 16.5%;
        }
        40% {
          top: 60%;
          left: 9%;
        }
        75% {
          top: 10%;
          left: 16.5%;
        }
        100% {
          top: 60%;
          left: 3%;
        }
      }
    `)
    }
  }
  rightSideAnimation() {
    this.unhitable = false
    this.onLeftSide = false
    this.element.style.animationPlayState = "paused"
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
    this.element.style.removeProperty("left")
    this.element.style.right = "9%"
    this.element.style.visibility = "visible"
    this.element.style.animation = `bossMoveRight ${4000}ms cubic-bezier(0.42, 0, 0.58, 1) infinite alternate`

    // Add the CSS animation keyframes:
    if (!bossMoveKeyframesAdded) {
      const styleSheet = document.styleSheets[1]
      styleSheet.insertRule(`
      @keyframes bossMoveRight {
        0% {  
          top: 10%;
          right: 9%;
        }

        25% {
          top: 60%;
          right: 16.5%;
        }
        40% {
          top: 60%;
          right: 9%;
        }
        75% {
          top: 10%;
          right: 16.5%;
        }
        100% {
          top: 60%;
          right: 3%;
        }
      }
    `)
    }
  }
  teleport() {
    this.element.classList.add("boss-teleport-charge")
    this.teleportInterval = setInterval(() => {
      if (gameIsPaused) {
        return
      }
      if (gameIsOver) {
        clearInterval(this.teleportInterval)
        return
      }
      clearInterval(this.teleportInterval)
      this.unhitable = true
      bossShotsArray = []
      const rect = this.element.getBoundingClientRect()
      this.element.classList.remove("boss-teleport-charge")
      this.insertTeleportDoor(rect.left, rect.top)
      this.element.style.transition = `opacity 0.4s linear`
      this.element.style.opacity = "0"
      this.teleportSecondInterval = setInterval(() => {
        if (gameIsPaused) {
          return
        }
        if (gameIsOver) {
          clearInterval(this.teleportSecondInterval)
          return
        }
        clearInterval(this.teleportSecondInterval)
        if (this.onLeftSide) {
          this.onLeftSide = false
          this.rightSideAnimation()
        } else {
          this.onLeftSide = true
          this.leftSideAnimation()
        }
      }, 1500)
    }, 2000)
  }
  insertTeleportDoor(leftPos, topPos) {
    setTimeout(() => {
      this.element.style.opacity = "1"
      if (this.onLeftSide) {
        this.teleportDoor.style.removeProperty("right")
        this.teleportDoor.style.left = "9%"
      } else {
        this.teleportDoor.style.removeProperty("left")
        this.teleportDoor.style.right = "9%"
      }
      this.teleportDoor.style.top = "10%"
      this.teleportDoor.style.visibility = "visible"
      this.teleportDoor.classList.add("teleportDoorAnimation")
      setTimeout(() => {
        this.teleportDoor.classList.remove("teleportDoorAnimation")
        this.teleportDoor.style.visibility = "hidden"
      }, 1500)
    }, 1501)
  }
  laserBeam() {
    this.element.classList.add("boss-laser-charge")
    this.laserBeamInterval = setInterval(() => {
      if (gameIsPaused) {
        return
      }
      if (gameIsOver || this.isDying) {
        clearInterval(this.laserBeamInterval)
        return
      }
      clearInterval(this.laserBeamInterval)
      this.element.classList.remove("boss-laser-charge")
      const laser = document.createElement("div")
      const shotImg = document.createElement("img")
      shotImg.src = "https://i.imgur.com/oMv2v1N.png"
      laser.appendChild(shotImg)
      bossShotsArray = []
      bossShotsArray.push(laser)
      // Set the initial position of the laser to match the current position of the moving element
      const rect = this.element.getBoundingClientRect()
      laser.style.top = rect.top + "px"
      laser.style.left = rect.left + rect.width / 2 + "px"

      // Set the laser's appearance and animation
      laser.style.position = "absolute"
      laser.style.width = "7.5vmin"
      laser.style.height = "7.5vmin"
      shotImg.style.width = "100%"
      shotImg.style.height = "100%"
      shotImg.style.objectFit = "cover"

      laser.style.transformOrigin = "top"
      if (this.onLeftSide) {
        laser.classList.add("laser-beam-left")
      } else {
        laser.classList.add("laser-beam-right")
      }

      document.body.appendChild(laser)
      laser.addEventListener(
        "animationend",
        function bossLaserAnimationEndHandler() {
          bossShotsArray = []
          if (laser.parentNode === document.body) {
            if (bottle.unhitable == false) {
              bottle.hp--
              bottle.checkHp(1)
            }
            document.body.removeChild(laser)
          }
          laser.removeEventListener(
            "animationend",
            bossLaserAnimationEndHandler
          )
        }
      )
    }, 2000)
  }
  threeShotsattack() {
    this.threeShotsChargeActive = true
    this.element.classList.add("boss-shots-charge")
    this.threeShotsAttackInterval = setInterval(() => {
      if (gameIsPaused) {
        return
      }
      if (gameIsOver || this.isDying) {
        clearInterval(this.threeShotsAttackInterval)
        return
      }
      clearInterval(this.threeShotsAttackInterval)
      this.threeShotsChargeActive = false
      this.element.classList.remove("boss-shots-charge")
      const shot1 = document.createElement("div")
      const shot2 = document.createElement("div")
      const shot3 = document.createElement("div")
      const shotImg = document.createElement("img")
      shotImg.src = "https://i.ibb.co/KLgr1q8/ghost.png"
      shot1.appendChild(shotImg)
      shot2.appendChild(shotImg.cloneNode(true))
      shot3.appendChild(shotImg.cloneNode(true))
      bossShotsArray = []
      bossShotsArray.push(shot1)
      bossShotsArray.push(shot2)
      bossShotsArray.push(shot3)

      // Set the initial position of each shot
      const rect = this.element.getBoundingClientRect()
      const shot1Top = rect.top + 100
      const shot3Top = rect.top - 100
      shot1.style.top = "0px"
      shot2.style.top = "0px"
      shot3.style.top = "0px"
      shot1.style.left = "25%"
      shot2.style.left = "50%"
      shot3.style.left = "75%"
      shot1.classList.add("boss-shot")
      shot2.classList.add("boss-shot")
      shot3.classList.add("boss-shot")

      document.body.appendChild(shot1)
      document.body.appendChild(shot2)
      document.body.appendChild(shot3)

      shot1.addEventListener(
        "animationend",
        function bossShotAnimationEndHandler() {
          bossShotsArray = []
          if (shot1.parentNode === document.body) {
            if (bottle.unhitable == false) {
              bottle.hp--
              bottle.checkHp(1)
            }
            document.body.removeChild(shot1)
          }
          shot1.removeEventListener("animationend", bossShotAnimationEndHandler)
        }
      )
      shot2.addEventListener(
        "animationend",
        function bossShotAnimationEndHandler() {
          bossShotsArray = []
          if (shot2.parentNode === document.body) {
            if (bottle.unhitable == false) {
              bottle.hp--
              bottle.checkHp(1)
            }
            document.body.removeChild(shot2)
          }
          shot2.removeEventListener("animationend", bossShotAnimationEndHandler)
        }
      )

      shot3.addEventListener(
        "animationend",
        function bossShotAnimationEndHandler() {
          bossShotsArray = []
          if (shot3.parentNode === document.body) {
            if (bottle.unhitable == false) {
              bottle.hp--
              bottle.checkHp(1)
            }
            document.body.removeChild(shot3)
          }
          shot3.removeEventListener("animationend", bossShotAnimationEndHandler)
        }
      )
    }, 2000)
  }
  demonSpawner() {
    this.element.classList.add("boss-spawner-charge")
    this.demonSpawnerInterval = setInterval(() => {
      if (gameIsPaused) {
        return
      }
      if (gameIsOver || this.isDying) {
        clearInterval(this.demonSpawnerInterval)
        return
      }
      clearInterval(this.demonSpawnerInterval)
      bossShotsArray = []

      this.element.classList.remove("boss-spawner-charge")
      if (demons.length > 7) {
        return
      }
      const demon = new Demon()
      demons.push(demon)
    }, 2000)
  }
  attackPattern() {
    if (gameIsPaused || gameIsOver) {
      return
    }
    this.attackPatternActive = true
    const randomNumber = Math.floor(Math.random() * 100) + 1

    const attackProbability = {
      demonSpanProb: 30,
      teleportProb: 55,
      laserBeamProb: 75,
    }
    if (demons.length > 7) {
      attackProbability.demonSpanProb = 10
      attackProbability.teleportProb = 40
      attackProbability.laserBeamProb = 70
    }

    if (randomNumber <= attackProbability.demonSpanProb) {
      this.demonSpawner()
    } else if (randomNumber <= attackProbability.teleportProb) {
      this.teleport()
    } else if (randomNumber <= attackProbability.laserBeamProb) {
      this.laserBeam()
    } else {
      this.threeShotsattack()
    }

    const randomTime = Math.random() * (4000 - 2000) + 3600
    this.attackPatternTimeout = setTimeout(() => {
      this.attackPattern()
    }, randomTime)
  }
  pauseShots(shotElement) {
    shotElement.style.animationPlayState = "paused"
  }
  continueShots(shotElement) {
    shotElement.style.animationPlayState = "running"
  }
  getHeartAbsolutePosition() {
    const bossRect = this.element.getBoundingClientRect()
    const heart = {
      x: bossRect.left + heartRelative.left * bossRect.width,
      y: bossRect.top + heartRelative.top * bossRect.height,
      width: heartRelative.width * bossRect.width,
      height: heartRelative.height * bossRect.height,
    }
    return heart
  }
  isShotCollidingWithHeart(shots, heart) {
    for (let i = 0; i < shots.length; i++) {
      const shot = shots[i]
      const shotRect = shot.element.getBoundingClientRect()

      const collision =
        shotRect.left < heart.x + heart.width &&
        shotRect.left + shotRect.width > heart.x &&
        shotRect.top < heart.y + heart.height &&
        shotRect.top + shotRect.height > heart.y

      if (collision) {
        shot.onCollision()
        gameStats.gameTotalHits++
        return true
      }
    }

    // If none of the shots collided with the heart, return false
    return false
  }
  bossHeartCheckCollision() {
    if (this.isDying || this.unhitable) {
      return
    }
    const heartNums = this.getHeartAbsolutePosition()
    const isCollided = this.isShotCollidingWithHeart(shots, heartNums)
    if (isCollided) {
      this.hp = this.hp - bottle.damage
      updateBossHpBar(this.hp, this.maxHp)
      if (this.hp <= 0) {
        this.isDying = true
        clearInterval(this.teleportInterval)
        clearInterval(this.laserBeamInterval)
        clearInterval(this.threeShotsAttackInterval)
        clearInterval(this.demonSpawnerInterval)
        clearTimeout(this.attackPatternTimeout)
        container.removeChild(this.teleportDoor)
        this.element.classList = ""
        const rect = this.element.getBoundingClientRect()
        this.element.style.left = `${rect.left}px`
        this.element.style.top = `${rect.top}px`
        this.element.style.animation = ""
        this.element.src = this.preloadedImages[4].src
        this.bossDeathAnimation()
      }
    }
  }
  bossDeathAnimation() {
    // remove existing demons if there are any from boss phase
    for (let i = 0; i < demons.length; i++) {
      demons[i].demonDeathAnimation()
    }
    setTimeout(() => {
      for (let i = 0; i < demons.length; i++) {
        demons[i].element.remove()
      }
      demons = []
    }, 301)
    gameStats.gameTotalElims++
    gameStats.gameBossKilled = true
    this.element.style.transition = `filter 2s linear`
    this.element.style.filter = "brightness(5)"

    const handleOpacityTransitionEnd = (event) => {
      if (event.propertyName === "opacity") {
        container.removeChild(this.element)
        setTimeout(() => {
          bossArray = []
          bossShotsArray = []
        }, 2501)
        phase3Active = false
        this.element.removeEventListener(
          "transitionend",
          handleOpacityTransitionEnd
        )
      }
    }

    const handleBackgroundColorTransitionEnd = (event) => {
      if (event.propertyName === "filter") {
        this.element.style.transition = `opacity 0.75s linear`
        this.element.style.opacity = "0"

        // Listen for the opacity transitionend event
        this.element.addEventListener(
          "transitionend",
          handleOpacityTransitionEnd
        )

        this.element.removeEventListener(
          "transitionend",
          handleBackgroundColorTransitionEnd
        )
      }
    }

    this.element.addEventListener(
      "transitionend",
      handleBackgroundColorTransitionEnd
    )
  }
}
class Coin extends Enemy {
  constructor(image) {
    super()
    this.element.src = "https://i.ibb.co/Mnrrzgg/dollar.png"
    this.element.style.position = "absolute"
    this.element.style.width = "3.6vmin"
    this.element.style.height = "3.6vmin"
    this.element.style.right = "-250px"
    this.maxHp = 1
    this.hp = 1
    this.unhitable
    this.respawnDelay
    this.coinIsActive = false
  }
  coinMovementAnimation() {
    if (gameIsOver) {
      return
    }
    this.unhitable = false
    this.coinIsActive = true
    this.element.style.removeProperty("bottom")
    this.element.style.removeProperty("left")
    this.element.style.removeProperty("right")
    this.element.style.removeProperty("top")
    const randomOption = Math.floor(Math.random() * 2)
    switch (randomOption) {
      case 0:
        // Random top with 0 left
        const randomPosition =
          Math.random() < 0.5
            ? Math.floor(Math.random() * (25 - 8 + 1) + 8)
            : Math.floor(Math.random() * (92 - 75 + 1) + 75)
        this.element.style.left = -100 + "px"
        this.element.style.top = randomPosition + "%"
        this.element.classList.add("coin1")
        break
      case 1:
        // Random top with 0 right
        const randomPosition2 =
          Math.random() < 0.5
            ? Math.floor(Math.random() * (25 - 8 + 1) + 8)
            : Math.floor(Math.random() * (92 - 75 + 1) + 75)
        this.element.style.right = -100 + "px"
        this.element.style.top = randomPosition2 + "%"
        this.element.classList.add("coin2")
        break
    }
    this.element.addEventListener(
      "animationend",
      this.onAnimationEnd.bind(this)
    )
  }
  coinRemoveAnimation() {
    this.element.classList.remove("coin1")
    this.element.classList.remove("coin2")
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
  }
  onCollision(otherObject) {
    if (
      this.element.style.animationPlayState === "paused" ||
      this.element.style.animation === "none" ||
      this.unhitable == true
    ) {
      return
    }
    gameStats.gameCoins++
    this.unhitable = true
    this.coinIsActive = false
    this.coinDeathAnimation()
    setTimeout(() => {
      this.onAnimationEnd({ target: this.element })
    }, 301)
  }
  onAnimationEnd(event) {
    // Your code to execute when the animation ends
    this.unhitable = true
    this.coinIsActive = false
    this.element.style.animationPlayState = "paused"
    this.element.style.animation = "none" // reset the animation
    this.element.style.animation = null
    this.element.classList = ""
    this.element.style.removeProperty("left")
    this.element.style.right = "-250px"
    // Remove the event listener
    event.target.removeEventListener(
      "animationend",
      this.onAnimationEnd.bind(this)
    )
  }
  coinDeathAnimation() {
    const rect = this.element.getBoundingClientRect()
    this.element.style.left = `${rect.left}px`
    this.element.style.top = `${rect.top}px`
    this.element.style.animation = null
    this.element.classList = ""
    this.element.classList.add("demon-fade")
    setTimeout(() => {
      this.element.classList.remove("demon-fade")
    }, 300)
  }
}
class User {
  constructor(userName) {
    this.userName
    this.mail
    this.token
    this.dateCreated = new Date()
    this.isGuest
    this.gamesPlayed = 0
    this.coins = 0
    this.highScore = 0
    this.accuracy = 0
    this.totalShots = 0
    this.totalHits = 0
    this.bossKilled = false
    this.demonElliminated = 0
    this.witchesElliminated = 0
    this.meteorsElliminated = 0
    this.bottleFlipKeyBind = "z"
    this.superShotsKeyBind = "x"
    this.shieldKeyBind = "c"
    this.resolutionPicked = "high"
    this.bottlesOwned = [
      {
        name: "default",
        src: "https://i.imgur.com/Dt3jvqV.png",
        shotSrc: "https://i.imgur.com/HfRYTkp.png",
        realSrc: "https://i.imgur.com/Og88sMT.png",
      },
    ] // src = loadout's img src
    this.bottleSelected = "default"
    this.userPowerups = [
      {
        name: "bottle flip",
        src: "https://i.ibb.co/VY18z1P/Mask-group-1.png",
        owned: 0,
        hotkey: "z",
        active: false,
        callFunction: activateBottleFlip,
      },
      {
        name: "super shots",
        src: "https://i.ibb.co/sQjMKLT/Group-22-2.png",
        owned: 0,
        hotkey: "x",
        active: false,
        callFunction: activateSuperShots,
      },
      {
        name: "shield",
        src: "https://i.ibb.co/C2F7c5g/Group-22-3.png",
        owned: 0,
        hotkey: "c",
        active: false,
        callFunction: activateShield,
      },
    ]
    this.userMissions = [
      {
        missionText: "reach 500 score",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.gameScore > 499,
      },
      {
        missionText: "reach 2500 score",
        prize: 25,
        status: "in progress",
        condition: (gameStats) => gameStats.gameScore > 2499,
      },
      {
        missionText: "reach 5000 score",
        prize: 50,
        status: "in progress",
        condition: (gameStats) => gameStats.gameScore > 4999,
      },
      {
        missionText: "reach 10000 score",
        prize: 80,
        status: "in progress",
        condition: (gameStats) => gameStats.gameScore > 9999,
      },
      {
        missionText: "reach 20000 score",
        prize: 80,
        status: "in progress",
        condition: (gameStats) => gameStats.gameScore > 19999,
      },
      {
        missionText: "use bottle flip powerup",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.usedBottleFlip == true,
      },
      {
        missionText: "use super shots powerup",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.usedSuperShots == true,
      },
      {
        missionText: "use shield powerup",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.usedShield == true,
      },
      {
        missionText: "eliminate the boss",
        prize: 30,
        status: "in progress",
        condition: (gameStats) => gameStats.gameBossKilled == true,
      },
      {
        missionText: "eliminate 20 enemies in 1 game",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalElims > 20,
      },
      {
        missionText: "eliminate 50 enemies in 1 game",
        prize: 10,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalElims > 49,
      },
      {
        missionText: "eliminate 100 enemies in 1 game",
        prize: 20,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalElims > 99,
      },
      {
        missionText: "100 hits in a single game",
        prize: 5,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalHits > 100,
      },
      {
        missionText: "250 hits in a single game",
        prize: 10,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalHits > 249,
      },
      {
        missionText: "500 hits in a single game",
        prize: 20,
        status: "in progress",
        condition: (gameStats) => gameStats.gameTotalHits > 499,
      },
      {
        missionText: "get 5 coins in 1 game",
        prize: 15,
        status: "in progress",
        condition: (gameStats) => gameStats.gameCoins > 4,
      },
    ]
  }
  createGuest() {
    this.isGuest = true
    const randomNumber = Math.floor(Math.random() * (2000 - 200 + 1) + 200)
    this.userName = "guest#" + randomNumber
    this.mail = "no email address"
  }
  turnIntoAccount() {
    // TODO: turn into account after can make accounts
  }
  logUserIn(userObj) {
    this.userName = userObj.userName
    this.mail = userObj.email
    this.token = userObj.token
    this.isGuest = false
    this.gamesPlayed = userObj.gamesPlayed
    this.coins = userObj.coins
    this.highScore = userObj.highScore
    this.totalShots = userObj.totalShots
    this.totalHits = userObj.totalHits
    this.bossKilled = userObj.bossKilled
    this.demonElliminated = userObj.demonElliminated
    this.witchesElliminated = userObj.witchesElliminated
    this.meteorsElliminated = userObj.meteorsElliminated
    this.bottleFlipKeyBind = userObj.bottleFlipKeyBind
    this.superShotsKeyBind = userObj.superShotsKeyBind
    this.shieldKeyBind = userObj.shieldKeyBind
    this.resolutionPicked = userObj.resolutionPicked
    this.bottlesOwned = userObj.bottlesOwned
    this.bottleSelected = userObj.bottleSelected
    for (let i = 0; i < this.userPowerups.length; i++) {
      this.userPowerups[i].active = userObj.userPowerups[i].active
      this.userPowerups[i].hotkey = userObj.userPowerups[i].hotkey
      this.userPowerups[i].owned = userObj.userPowerups[i].owned
    }
    for (let i = 0; i < this.userMissions.length; i++) {
      this.userMissions[i].status = userObj.userMissions[i].status
    }
    const matchingBottle = this.bottlesOwned.find(
      (bottle) => bottle.name === this.bottleSelected
    )
    bottle.img.src = matchingBottle.realSrc
    shotsSRC = matchingBottle.shotSrc
  }
  updateAccuracy(gameShots, gameHits) {
    if (gameShots === 0) {
      this.accuracy = "N/A"
    } else {
      this.accuracy = ((gameHits / gameShots) * 100).toFixed(2)
    }
  }
}

// Variables
// main.js
import {
  positionsLeftRandomToBottom,
  positionsLeftRandomToTop,
  positionsTopRandomToLeft,
  positionsTopRandomToRight,
  shakeScreen,
  starsMoveIngame,
  createReturnHomeButton,
  handleMuteClick,
  playSound,
} from "./coreFunctions.js"
let container = document.getElementById("container")
const bottle = new Bottle()
bottle.bottleContainer.classList.add("bottle-float")
const coin = new Coin()
let shotsSRC = "https://i.imgur.com/HfRYTkp.png"
const hpImg = "https://i.ibb.co/hfm43nr/Hp.png"
const greyHpImg = "https://i.ibb.co/2NvDv7v/greyHp.png"
const gamePausedDiv = document.getElementById("gamePausedDiv")
let playButton = document.getElementById("playButton")
let platformImg = document.getElementById("platformImg")
const pauseDiv = document.getElementById("pauseDiv")
let demons = [] // Will hold Demon Enemies
let witches = [] // Will hold Witch Enemies
let meteors = []
let shots = [] // Will hold User Shots
let bossArray = []
let witchShotArray = []
let pausedCases = []
let bossShotsArray = []
let hpImgArray = []
let animationState = []
let meteorAnimationState = []
let starsElements = []
let starsElementsState = []
let witchesCreated = 0
let scoreWhenFirstBossDied = 0
let shotsCounter = 0
let score = 0
let hpImgIteration = 0
let scoreMultiplier = 1
let shieldTimeLeft = 3000 //ms
let superShotsTimeLeft = 10000 //ms
let gameIsOver = true
let gameIsPaused = false
let witchOnLeft = false
let witchOnRight = false
let gameIsOn = false
let isLogged = false
let meteorInScreen = false
let phase2point5Activated = false
let phase2point9Activated = false
let phase3Active = false
let bossMoveKeyframesAdded = false
let rightWitchAnimationCreated = false
let leftWitchAnimationCreated = false
let rightWitchDefaultAnimationCreated = false
let leftWitchDefaultAnimationCreated = false
let hpTableSet = false
let popUpExists = false
let bottleFlipUsed = false
let shieldUsed = false
let superShotsUsed = false
let bottleFlipBeingUsed = false
let superShotsBeingUsed = false
let shieldBeingUsed = false
let shieldPressed = false
let bottlesContainerSliding = false
let witchRespawnDelaytime
let witchInterval
let demonInterval
let bossAttackPatternTimeout
let coinSpawnerActive
let scoreInterval
let superShotsTimeoutId
let superShotsStartTime
let coinAnimationState
let user
const heartRelative = {
  // % values used for boss heart position calculation
  top: 0.44921875,
  left: 0.33984375,
  width: 0.15625,
  height: 0.15625,
}
let gameStats = {
  gameTotalShots: 0,
  gameTotalHits: 0,
  gameScore: 0,
  gameCoins: 0,
  gameStart: new Date(),
  gameEnd: "",
  gameTotalElims: 0,
  gameBossKilled: false,
  usedBottleFlip: false,
  usedSuperShots: false,
  usedShield: false,
  gamePaused: null,
  pausedDuration: 0,
}
let soundFXvolume = 1.0
let musicVolume = 1.0

// Functions & Event listeners

// Fundamental functions
function handleClick(event) {
  // Defining Shots logic
  let shot = shots[shotsCounter]

  // Move the Shot object
  shot.move(event)

  // Increment the counter variable and reset it if it exceeds the number of Shot objects
  shotsCounter++
  if (shotsCounter >= shots.length) {
    shotsCounter = 0
  }
}
function startScore() {
  scoreInterval = setInterval(() => {
    score = score + 1 * scoreMultiplier
    document.getElementById("scoreDiv").innerText = score
  }, 100)
}
function setHPtable() {
  if (bottle.hp < 0 || hpTableSet == true) {
    return
  }
  const hpTR = document.getElementById("hpTR")
  if (bottle.hp == 10) {
    document.getElementById("hpDiv").style.width = "20%"
  }
  document.getElementById("hpDiv").style.visibility = "visible"
  hpTableSet = true
  hpImgIteration = 0
  hpTR.innerText = ""
  for (let i = 0; i < bottle.hp; i++) {
    const newTD = document.createElement("td")
    const newImg = document.createElement("img")
    newImg.src = hpImg
    newImg.className = "hpImg"
    newTD.appendChild(newImg)
    hpTR.appendChild(newTD)
    hpImgArray.push(newImg)
  }
}
// Game functions (start game, phases, pause, continue, game over, quit)
playButton.addEventListener("click", () => {
  bottle.bottleContainer.classList.remove("bottle-float")
  platformImg.style.bottom = "-20%"
  hideUI()
  pauseDiv.style.visibility = "visible"
  gameIsOn = true
  gameIsOver = false
  shotsCounter = 0
  bottle.hp = bottle.maxHp
  startScore()
  setHPtable()
  starsMoveIngame()
  scoreMultiplier = 1
  score = 0
  witchesCreated = 0
  scoreWhenFirstBossDied = 0
  phase3Active = false
  bossShotsArray = []
  meteors = []
  gameStats = {
    gameTotalShots: 0,
    gameTotalHits: 0,
    gameScore: 0,
    gameCoins: 0,
    gameStart: new Date(),
    gameEnd: "",
    gameTotalElims: 0,
    gameBossKilled: false,
    usedBottleFlip: false,
    usedSuperShots: false,
    usedShield: false,
    gamePaused: null,
    pausedDuration: 0,
  }
  bottleFlipUsed = false
  shieldUsed = false
  superShotsUsed = false
  shieldTimeLeft = 3000 //ms
  bottleFlipBeingUsed = false
  superShotsBeingUsed = false
  shieldBeingUsed = false
  shieldPressed = false
  setTimeout(() => {
    document.getElementById("starsFullScreenContainer").style.opacity = "1"
  }, 10)
  document.getElementById("starsContainer").style.opacity = "0"
  document.getElementById("containerverlay").style.opacity = "1"
  for (let i = 0; i < user.userPowerups.length; i++) {
    if (user.userPowerups[i].active) {
      const newPowerupDiv = document.createElement("div")
      const newPowerupImg = document.createElement("img")
      const newPowerupSpan = document.createElement("span")
      newPowerupDiv.className = "in-game-powerup-div"
      newPowerupImg.src = user.userPowerups[i].src
      newPowerupSpan.innerText = user.userPowerups[i].hotkey
      newPowerupDiv.appendChild(newPowerupImg)
      newPowerupDiv.appendChild(newPowerupSpan)
      if (i == 0) {
        newPowerupDiv.style.left = "2.5%"
        newPowerupDiv.id = "inGameBottleFlipPowerupDiv"
      } else if (i == 1) {
        newPowerupDiv.style.left = "5.5%"
        newPowerupDiv.id = "inGameSuperShotsPowerupDiv"
      } else if (i == 2) {
        newPowerupDiv.style.left = "8.5%"
        newPowerupDiv.id = "inGameShieldPowerupDiv"
      }
      container.appendChild(newPowerupDiv)
      setTimeout(() => {
        newPowerupDiv.style.top = "90%"
      }, 10)
    }
  }
  document.addEventListener("keydown", function (event) {
    // Key handler event listener to check for game pause and for powerup activation
    if (gameIsOn == false || gameIsPaused == true) {
      return
    }

    if (event.key === "Escape") {
      pauseGame()
      return
    }
    if (bottleFlipBeingUsed) {
      return
    }
    for (let i = 0; i < user.userPowerups.length; i++) {
      if (!user.userPowerups[i].active) {
        continue
      }
      if (event.key === user.userPowerups[i].hotkey) {
        user.userPowerups[i].callFunction()
        return
      }
    }
  })
  clearInterval(demonInterval)
  demonInterval = setInterval(createDemon, 1000)

  function createDemon() {
    // Create 3 Demons
    if (demons.length >= 3 || gameIsOver == true) {
      clearInterval(demonInterval)
    } else if (gameIsPaused) {
      return
    } else {
      let demon = new Demon()
      demons.push(demon)
    }
  }

  container.addEventListener("click", handleClick) // Create shots
  let newShot1 = new Shot("shot1", 1, 100, 3)
  let newShot2 = new Shot("shot1", 1, 100, 3)
  let newShot3 = new Shot("shot1", 1, 100, 3)
  shots.push(newShot1, newShot2, newShot3)

  // Start the game loop
  requestAnimationFrame(phase1)
})
function phase1() {
  if (gameIsOver) {
    return
  }
  // Check for Demon collisions with Shot/Bottle
  for (let i = 0; i < demons.length; i++) {
    if (demons[i].unhitable == true) {
      continue
    }
    demons[i].checkCollision(shots)
    const demonRect = demons[i].element.getBoundingClientRect()
    const bottleRect = bottle.img.getBoundingClientRect()

    if (
      demonRect.right >= bottleRect.left &&
      demonRect.left <= bottleRect.right &&
      demonRect.bottom >= bottleRect.top &&
      demonRect.top <= bottleRect.bottom
    ) {
      demons[i].onBottleTouch()
    }
  }
  // Request next animation frame
  if (score > 250) {
    phase2Pre()
    requestAnimationFrame(phase2)
  } else {
    requestAnimationFrame(phase1)
  }
}
function phase2Pre() {
  phase2point5Activated = false
  phase2point9Activated = false
  scoreMultiplier++
  witchRespawnDelaytime = 15000
  clearInterval(demonInterval)
  demonInterval = setInterval(createDemon, 2000)
  coinSpawner()

  function createDemon() {
    // Create 2 more Demons
    if (demons.length >= 5) {
      clearInterval(demonInterval)
    } else if (gameIsPaused) {
      return
    } else {
      let demon = new Demon()
      demons.push(demon)
    }
  }
  witchInterval = setInterval(
    createWitch,
    Math.floor(Math.random() * (17500 - 10000 + 1)) + 10000
  )
  function createWitch() {
    if (witchOnLeft != true || witchOnRight != true) {
      // If left or right in-game witch slot is free

      if (witchesCreated >= 2) {
        clearInterval(witchInterval)
        return
      }
      if (gameIsPaused) {
        return
      }
      let witch = new Witch()
      witchesCreated++
      witches.push(witch)
    }
  }
}
function phase2() {
  if (gameIsOver) {
    return
  }
  // Check for Demon collisions with Shot/Bottle
  const bottleRect = bottle.img.getBoundingClientRect()
  for (let i = 0; i < demons.length; i++) {
    if (demons[i].unhitable == true) {
      continue
    }
    demons[i].checkCollision(shots)
    const demonRect = demons[i].element.getBoundingClientRect()

    if (
      demonRect.right >= bottleRect.left &&
      demonRect.left <= bottleRect.right &&
      demonRect.bottom >= bottleRect.top &&
      demonRect.top <= bottleRect.bottom
    ) {
      demons[i].onBottleTouch()
    }
  }
  // Check for Witch collisions with Shot
  for (let i = 0; i < witches.length; i++) {
    witches[i].checkCollision(shots)
  }

  // Check for Coin collisions with Shot
  if (coin.coinIsActive) {
    coin.checkCollision(shots)
  }

  // Request next animation frame
  if (score < 250) {
    // score 251 ~ 1499  -- 1500
    requestAnimationFrame(phase2)
  } else if (score < 800) {
    // 1899 ~ 2749    -- 2750
    phase2point5()
    requestAnimationFrame(phase2)
  } else if (score < 1000) {
    // 2899 ~ 4799     -- 4800
    phase2point9()
    requestAnimationFrame(phase2)
  } else {
    // 4800+
    phase3Pre()
    requestAnimationFrame(phase3)
  }
}
function phase2point5() {
  if (phase2point5Activated) {
    return
  } else {
    phase2point5Activated = true // Make function run only once

    clearInterval(demonInterval)
    demonInterval = setInterval(createDemon, 2000)
    function createDemon() {
      // Create 2 more Demons
      if (demons.length >= 7) {
        clearInterval(demonInterval)
      } else if (gameIsPaused) {
        return
      } else {
        let demon = new Demon()
        demons.push(demon)
      }
    }
  }
}
function phase2point9() {
  if (phase2point9Activated) {
    return
  } else {
    phase2point9Activated = true
    witchRespawnDelaytime = 8000
  }
}
function updateBossHpBar(currentHp, totalHp) {
  const hpBarGreen = document.getElementById("hp-bar-green")
  if (currentHp == 0) {
    document.getElementById("hp-bar-container").style.visibility = "hidden"
    hpBarGreen.style.width = `100%`
    return
  }
  const hpPercentage = (currentHp / totalHp) * 100
  hpBarGreen.style.width = `${hpPercentage}%`
}
function phase3Pre() {
  scoreMultiplier++
  phase3Active = true
  witchOnLeft = false
  witchOnRight = false
  document.getElementById("hp-bar-green").style.width = `100%`
  document.getElementById("hp-bar-container").style.visibility = "visible"
  if (demonInterval) {
    clearInterval(demonInterval)
  }
  if (witchInterval) {
    clearInterval(witchInterval)
  }
  for (let i = 0; i < demons.length; i++) {
    demons[i].demonDeathAnimation()
  }
  setTimeout(() => {
    for (let i = 0; i < demons.length; i++) {
      demons[i].element.remove()
    }
    demons = []
  }, 301)
  for (let i = 0; i < witches.length; i++) {
    witches[i].witchDeathAnimation()
  }
  setTimeout(() => {
    for (let i = 0; i < witches.length; i++) {
      witches[i].witchIsAlive = false
      witches[i].remove()
    }
    witches = []
  }, 751)
  const theFirstBoss = new firstBoss()
  bossArray.push(theFirstBoss)
}
function phase3() {
  // BOSS phase
  if (gameIsOver) {
    return
  } else if (phase3Active == false) {
    scoreWhenFirstBossDied = score
    checkBossShotsOnBossDeath()
    requestAnimationFrame(phase4Pre)
    return
  }

  bossArray[0].bossHeartCheckCollision()
  for (let i = 0; i < demons.length; i++) {
    if (demons[i].unhitable == true) {
      continue
    }
    demons[i].checkCollision(shots)
    const demonRect = demons[i].element.getBoundingClientRect()
    const bottleRect = bottle.img.getBoundingClientRect()

    if (
      demonRect.right >= bottleRect.left &&
      demonRect.left <= bottleRect.right &&
      demonRect.bottom >= bottleRect.top &&
      demonRect.top <= bottleRect.bottom
    ) {
      demons[i].onBottleTouch()
    }
  }
  for (let i = 0; i < bossShotsArray.length; i++) {
    if (bossArray.length > 0) {
      bossArray[0].checkCollision(shots, bossShotsArray[i])
    }
  }
  requestAnimationFrame(phase3)
}
function phase4Pre() {
  // Respawn all after boss
  setTimeout(() => {
    if (coinSpawnerActive == false) {
      coinSpawner()
    }

    clearInterval(demonInterval)
    demonInterval = setInterval(createDemon, 1000)
    function createDemon() {
      // Create 8 Demons
      if (demons.length >= 8 || gameIsOver == true) {
        clearInterval(demonInterval)
      } else if (gameIsPaused) {
        return
      } else {
        let demon = new Demon()
        demons.push(demon)
      }
    }
    witchOnLeft = false
    witchOnRight = false
    witchesCreated = 0
    witchInterval = setInterval(
      createWitch,
      Math.floor(Math.random() * (17500 - 10000 + 1)) + 3000
    )
    function createWitch() {
      if (witchOnLeft != true || witchOnRight != true) {
        // If left or right in-game witch slot is free

        if (witchesCreated >= 2 || gameIsOver) {
          clearInterval(witchInterval)
          return
        }
        if (gameIsPaused) {
          return
        }
        let witch = new Witch()
        witchesCreated++
        witches.push(witch)
      }
    }
  }, 1250)
  requestAnimationFrame(phase4)
}
function checkBossShotsOnBossDeath() {
  if (!bossArray.length > 0) {
    return
  }
  for (let i = 0; i < bossShotsArray.length; i++) {
    bossArray[0].checkCollision(shots, bossShotsArray[i])
  }
  requestAnimationFrame(checkBossShotsOnBossDeath)
}
function phase4() {
  if (gameIsOver) {
    return
  }
  // Check for Demon collisions with Shot/Bottle
  for (let i = 0; i < demons.length; i++) {
    if (demons[i].unhitable == true) {
      continue
    }
    demons[i].checkCollision(shots)
    const demonRect = demons[i].element.getBoundingClientRect()
    const bottleRect = bottle.img.getBoundingClientRect()

    if (
      demonRect.right >= bottleRect.left &&
      demonRect.left <= bottleRect.right &&
      demonRect.bottom >= bottleRect.top &&
      demonRect.top <= bottleRect.bottom
    ) {
      demons[i].onBottleTouch()
    }
  }
  // Check for Witch collisions with Shot/Bottle
  for (let i = 0; i < witches.length; i++) {
    witches[i].checkCollision(shots)
  }
  // Check for Coin collisions with Shot
  if (coin.coinIsActive) {
    coin.checkCollision(shots)
  }
  // Request next animation frame
  if (score > scoreWhenFirstBossDied + 1500) {
    requestAnimationFrame(phase5Pre)
  } else {
    requestAnimationFrame(phase4)
  }
}
function phase5Pre() {
  scoreMultiplier++
  const src1 = "https://i.ibb.co/s52tzJM/asteroid-1.png"
  const src2 = "https://i.ibb.co/XVMKTHG/asteroid.png"

  const img1 = new Image()
  const img2 = new Image()
  const loadImage = (image, src) => {
    // function that gets an Img object and a src and uses a promise to pre load the images
    return new Promise((resolve) => {
      image.onload = () => resolve(image)
      image.src = src
    })
  }

  Promise.all([loadImage(img1, src1), loadImage(img2, src2)]).then(
    (loadedImages) => {
      const [loadedImg1, loadedImg2] = loadedImages
      const newMeteor1 = new Meteor(loadedImg1)
      meteors.push(newMeteor1)
      const createSecondMeteor = () => {
        if (gameIsOver) {
          return
        }

        if (gameIsPaused) {
          setTimeout(createSecondMeteor, 4000)
        } else {
          const newMeteor2 = new Meteor(loadedImg2)
          meteors.push(newMeteor2)
        }
      }

      setTimeout(createSecondMeteor, 10000)

      requestAnimationFrame(phase5)
    }
  )
}
function phase5() {
  if (gameIsOver) {
    return
  }

  // Check for Demon collisions with Shot/Bottle
  for (let i = 0; i < demons.length; i++) {
    if (demons[i].unhitable == true) {
      continue
    }
    demons[i].checkCollision(shots)
    const demonRect = demons[i].element.getBoundingClientRect()
    const bottleRect = bottle.img.getBoundingClientRect()

    if (
      demonRect.right >= bottleRect.left &&
      demonRect.left <= bottleRect.right &&
      demonRect.bottom >= bottleRect.top &&
      demonRect.top <= bottleRect.bottom
    ) {
      demons[i].onBottleTouch()
    }
  }
  // Check for Witch collisions with Shot/Bottle
  for (let i = 0; i < witches.length; i++) {
    witches[i].checkCollision(shots)
  }

  // Check for Meteor collisions with Shot/Bottle
  for (let i = 0; i < meteors.length; i++) {
    if (meteors[i].unhitable == true) {
      continue
    }
    meteors[i].checkCollision(shots)
    const meteorRect = meteors[i].element.getBoundingClientRect()
    const bottleRect = bottle.img.getBoundingClientRect()

    if (
      meteorRect.right >= bottleRect.left &&
      meteorRect.left <= bottleRect.right &&
      meteorRect.bottom >= bottleRect.top &&
      meteorRect.top <= bottleRect.bottom
    ) {
      meteors[i].onBottleTouch()
    }
  }
  // Check for Coin collisions with Shot
  if (coin.coinIsActive) {
    coin.checkCollision(shots)
  }

  requestAnimationFrame(phase5)
}
// coins and powerups functions
function coinSpawner() {
  if (coinSpawnerActive) {
    return
  }
  function spawnCoin() {
    coinSpawnerActive = true
    if (gameIsOver || phase3Active) {
      coinSpawnerActive = false
      coin.unhitable = true
      coin.coinRemoveAnimation()
      coin.element.style.right = "-250px"
      return
    }

    if (gameIsPaused) {
      setTimeout(spawnCoin, 1000) // Check again in 1 second
      return
    }

    let coinSpawnDelay = Math.floor(Math.random() * (45000 - 20000 + 1) + 20000)
    if (score > 1000 && score < 2500) {
      coinSpawnDelay = Math.floor(Math.random() * (35000 - 15000 + 1) + 15000)
    } else if (score > 2500) {
      coinSpawnDelay = Math.floor(Math.random() * (30000 - 12000 + 1) + 12000)
    }

    coin.coinMovementAnimation()
    setTimeout(spawnCoin, coinSpawnDelay)
  }
  spawnCoin()
}
function activateBottleFlip() {
  if (bottleFlipUsed) {
    return
  }
  bottleFlipBeingUsed = true
  bottleFlipUsed = true
  document.getElementById("inGameBottleFlipPowerupDiv").style.top = "120%"
  user.userPowerups[0].owned--
  document.removeEventListener("mousemove", bottle.mouseMoveHandler)
  container.removeEventListener("click", handleClick)
  bottle.unhitable = true
  bottle.img.classList.add("bottle-flip-pre-animation")
  setTimeout(() => {
    bottle.img.classList.remove("bottle-flip-pre-animation")
    bottle.img.classList.add("bottle-flip-animation")
    setTimeout(() => {
      shakeScreen(2, 500)
      for (let i = 0; i < demons.length; i++) {
        demons[i].onCollision()
      }
      for (let i = 0; i < witches.length; i++) {
        witches[i].onCollision()
      }
      for (let i = 0; i < meteors.length; i++) {
        meteors[i].onCollision()
      }
      bottle.img.classList.remove("bottle-flip-animation")
      bottle.unhitable = false
      bottleFlipBeingUsed = false
      document.addEventListener("mousemove", bottle.mouseMoveHandler)
      container.addEventListener("click", handleClick)
    }, 750)
  }, 250)
}
function activateSuperShots() {
  if (superShotsUsed) {
    return
  }
  superShotsUsed = true
  superShotsBeingUsed = true
  document.getElementById("inGameSuperShotsPowerupDiv").style.top = "120%"
  user.userPowerups[1].owned--
  bottle.damage = 3
  for (let i = 0; i < shots.length; i++) {
    shots[i].element.style.width = "10vmin"
    shots[i].element.style.height = "10vmin"
    shots[i].element.style.filter = "drop-shadow(0px 0px 6px #1C7293)"
  }
  callSuperShotsTimeout()
}
function callSuperShotsTimeout() {
  superShotsStartTime = Date.now()
  superShotsTimeoutId = setTimeout(() => {
    if (gameIsPaused) {
      return
    }
    superShotsBeingUsed = false
    bottle.damage = 1
    for (let i = 0; i < shots.length; i++) {
      shots[i].element.style.width = "6vmin"
      shots[i].element.style.height = "6vmin"
      shots[i].element.style.filter = ""
    }
  }, superShotsTimeLeft)
}
function activateShield() {
  if (shieldUsed || shieldBeingUsed) {
    return
  }
  shieldBeingUsed = true
  shieldPressed = true
  const shieldStartTime = new Date()
  bottle.unhitable = true
  const shieldImg = document.createElement("img")
  shieldImg.src = user.userPowerups[2].src
  shieldImg.className = "in-game-shield-powerup-img"
  container.appendChild(shieldImg)
  const shieldTimeout = setTimeout(() => {
    if (!shieldBeingUsed) {
      return
    }
    finishShield()
  }, shieldTimeLeft)
  document.addEventListener("keyup", finishShield)
  function finishShield(event) {
    if (!event || event.key === user.userPowerups[2].hotkey) {
      document.removeEventListener("keyup", finishShield)
      shieldImg.remove()
      bottle.unhitable = false
      shieldBeingUsed = false
      const shieldEndTime = new Date()
      let shieldTimeUsed = shieldEndTime - shieldStartTime
      shieldTimeLeft = shieldTimeLeft - shieldTimeUsed
      if (shieldTimeLeft < 1) {
        shieldUsed = true
        user.userPowerups[2].owned--
        document.getElementById("inGameShieldPowerupDiv").style.top = "120%"
      }
      clearTimeout(shieldTimeout)
    }
  }
}
function gameOver() {
  gameStats.gameEnd = new Date()
  gameStats.gameScore = score
  gameIsPaused = false
  gameIsOn = false
  animationState = []
  meteorAnimationState = []
  pauseButton.src = "https://i.ibb.co/9H5JxpL/Group-14.png"
  pauseDiv.setAttribute("onClick", "pauseGame()")
  pauseDiv.style.visibility = "hidden"
  score = 0
  scoreMultiplier = 1
  clearInterval(scoreInterval)
  witchOnLeft = false
  witchOnRight = false
  hpImgArray = []
  document.getElementById("hp-bar-container").style.visibility = "hidden"
  document.getElementById("starsContainer").style.opacity = "1"
  document.getElementById("starsFullScreenContainer").style.opacity = "0"
  document.getElementById("containerverlay").style.opacity = "0"
  coin.coinRemoveAnimation()
  coin.element.style.right = "-250px"
  setTimeout(() => {
    document.getElementById("starsFullScreenContainer").remove()
  }, 500)
  document.getElementById("gameOverDiv").style.top = "25%"
  if (demonInterval) {
    clearInterval(demonInterval)
  }
  if (witchInterval) {
    clearInterval(witchInterval)
  }
  gameIsOver = true
  for (let i = 0; i < demons.length; i++) {
    demons[i].element.remove()
  }
  demons = []
  for (let i = 0; i < witches.length; i++) {
    witches[i].witchIsAlive = false
    witches[i].remove()
  }
  witches = []
  for (let i = 0; i < meteors.length; i++) {
    meteors[i].element.remove()
  }
  meteors = []
  for (let i = 0; i < shots.length; i++) {
    shots[i].element.remove()
  }
  shots = []

  if (phase3Active) {
    clearInterval(bossArray[0].teleportInterval)
    clearInterval(bossArray[0].laserBeamInterval)
    clearInterval(bossArray[0].threeShotsAttackInterval)
    clearInterval(bossArray[0].demonSpawnerInterval)
    clearTimeout(bossArray[0].attackPatternTimeout)
    container.removeChild(bossArray[0].element)
    bossArray = []
  }
  phase3Active = false

  container.removeEventListener("click", handleClick)

  let powerupsElements = document.getElementsByClassName("in-game-powerup-div")
  let powerupsElementsArray = Array.from(powerupsElements)

  for (let i = 0; i < powerupsElementsArray.length; i++) {
    powerupsElementsArray[i].parentNode.removeChild(powerupsElementsArray[i])
  }

  //GAME STATS
  // calculate game length
  let totalDurationMillis =
    gameStats.gameEnd.getTime() - gameStats.gameStart.getTime()
  let activeDurationMillis = totalDurationMillis - gameStats.pausedDuration

  let activeDurationSeconds = Math.floor(activeDurationMillis / 1000)
  let remainingMinutes = Math.floor(activeDurationSeconds / 60) % 60
  let remainingSeconds = activeDurationSeconds % 60
  const gameDuration = `${remainingMinutes
    .toString()
    .padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  // calculate user accuaracy
  gameStats.gameTotalShots--
  let accuracy
  let roundedAccuracy
  if (gameStats.gameTotalShots === 0) {
    roundedAccuracy = "N/A"
  } else {
    accuracy = (gameStats.gameTotalHits / gameStats.gameTotalShots) * 100
    roundedAccuracy = parseFloat(accuracy.toFixed(1))
  }

  //update game stats in gameOverDiv
  document.getElementById("eliminations").innerText = gameStats.gameTotalElims
  document.getElementById("timeAlive").innerText = gameDuration
  document.getElementById("accuracy").innerText = roundedAccuracy + "%"
  document.getElementById("scoreGameOver").innerText = gameStats.gameScore
  document.getElementById("newHighScoreText").style.visibility = "hidden"

  //update user data
  user.gamesPlayed++
  user.totalShots = user.totalShots + gameStats.gameTotalShots
  user.totalHits = user.totalHits + gameStats.gameTotalHits
  user.coins = user.coins + gameStats.gameCoins
  if (user.bossKilled == false) {
    user.bossKilled = gameStats.gameBossKilled
  }
  if (bottleFlipUsed) {
    gameStats.usedBottleFlip = true
  }
  if (superShotsUsed) {
    gameStats.usedSuperShots = true
  }
  if (shieldPressed) {
    gameStats.usedShield = true
  }
  if (gameStats.gameScore > user.highScore) {
    user.highScore = gameStats.gameScore
    document.getElementById("newHighScoreText").style.visibility = "visible"
  } // highscore
  for (let i = 0; i < user.userMissions.length; i++) {
    // missions
    if (user.userMissions[i].status !== "in progress") {
      continue
    }
    if (user.userMissions[i].condition(gameStats)) {
      user.userMissions[i].status = "claim reward"
    }
  }
  for (let i = 0; i < user.userPowerups.length; i++) {
    if (user.userPowerups[i].owned < 1) {
      user.userPowerups[i].active = false
    }
  }
  const gameOverData = {
    totalShots: gameStats.gameTotalShots,
    totalHits: gameStats.gameTotalHits,
    coins: gameStats.gameCoins,
    bossKilled: gameStats.gameBossKilled,
    usedBottleFlip: bottleFlipUsed,
    usedSuperShots: superShotsUsed,
    usedShield: shieldPressed,
    score: gameStats.gameScore,
  }
  const token = user.token
  fetch("http://localhost:3000/api/game/gameover", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ gameOverData }),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("succesfully saved game over data")
    })
    .catch((error) => {
      console.error(error) // Handle any errors
    })
}
document.addEventListener("keydown", function (event) {
  if (gameIsOn == false || gameIsPaused == true) {
    return
  }

  if (event.key === "Escape") {
    pauseGame()
    return
  }
  if (bottleFlipBeingUsed) {
    return
  }
  for (let i = 0; i < user.userPowerups.length; i++) {
    if (!user.userPowerups[i].active) {
      continue
    }
    if (event.key === user.userPowerups[i].hotkey) {
      user.userPowerups[i].callFunction()
      return
    }
  }
})
function pauseGame() {
  if (gameIsPaused == true || gameIsOn == false) {
    return
  }
  gameIsPaused = true
  gameStats.gamePaused = new Date()
  animationState = []
  meteorAnimationState = []
  coinAnimationState = ""
  container.removeEventListener("click", handleClick)
  pauseButton.src = "https://i.ibb.co/tLfLgCm/Group-15-1.png"
  pauseDiv.setAttribute("onClick", "continueGame()")
  clearInterval(scoreInterval)

  gamePausedDiv.style.top = "50%"

  // pause star movement animations
  const starElements = Array.from(
    document.querySelectorAll(
      ".stars-full-screen-one, .stars-full-screen-two, .stars-full-screen-three"
    )
  )
  for (let i = 0; i < starElements.length; i++) {
    starsElements.push(starElements[i])
    const state = starElements[i].style.animationPlayState
    starsElementsState.push(state)
    starElements[i].style.animationPlayState = "paused"
  }
  // loop through each demon object
  for (let i = 0; i < demons.length; i++) {
    // get the element associated with the current demon object
    const element = demons[i].element

    // check if the element has the animation class
    const hasAnimationClass =
      element.classList.contains("enemy1") ||
      element.classList.contains("enemy2") ||
      element.classList.contains("enemy3")

    if (hasAnimationClass) {
      // if the animation has started, store the current animation state in the animationState array
      const state = element.style.animationPlayState
      animationState[i] = state

      // pause the animation
      element.style.animationPlayState = "paused"
    }
  }
  // loop through each witch object
  for (let i = 0; i < witches.length; i++) {
    witches[i].pauseAnimation()
  }

  const witchShots = document.querySelectorAll(".witchShot")
  const witchShotElements = []
  if (witchShots.length > 0) {
    for (let i = 0; i < witchShots.length; i++) {
      witchShots[i].style.animationPlayState = "paused"
      witchShotElements.push(witchShots[i])
    }
  }
  // loop through each meteor object
  for (let i = 0; i < meteors.length; i++) {
    // get the element associated with the current demon object
    const element = meteors[i].element

    // check if the element has the animation class
    const hasAnimationClass =
      element.classList.contains("meteor1") ||
      element.classList.contains("meteor2")

    if (hasAnimationClass) {
      // if the animation has started, store the current animation state in the meteorAnimationState array
      const state = element.style.animationPlayState
      meteorAnimationState[i] = state

      // pause the animation
      element.style.animationPlayState = "paused"
    }
  }
  if (coin.coinIsActive) {
    coinAnimationState = coin.element.style.animationPlayState
    coin.element.style.animationPlayState = "paused"
  }
  if (phase3Active) {
    bossArray[0].gameWasPaused = true
    clearTimeout(bossAttackPatternTimeout)
    bossArray[0].attackPatternActive = false
    clearTimeout(bossArray[0].attackPatternTimeout)
    bossArray[0].element.style.animationPlayState = "paused"
    for (let i = 0; i < bossShotsArray.length; i++) {
      bossArray[0].pauseShots(bossShotsArray[i])
    }
  }
  if (superShotsBeingUsed) {
    const pauseGameTime = new Date()
    const timeRan = pauseGameTime - superShotsStartTime
    superShotsTimeLeft = superShotsTimeLeft - timeRan
    clearTimeout(superShotsTimeoutId)
  }
}
function continueGame() {
  if (gameIsOver) {
    return
  }
  gameIsPaused = false
  container.addEventListener("click", handleClick)
  pauseButton.src = "https://i.ibb.co/9H5JxpL/Group-14.png"
  pauseDiv.setAttribute("onClick", "pauseGame()")
  gamePausedDiv.style.top = "-75%"
  startScore()
  let now = new Date()
  let pauseDuration = now.getTime() - gameStats.gamePaused.getTime()
  gameStats.pausedDuration += pauseDuration
  gameStats.gamePaused = null

  // loop through each witch object
  for (let i = 0; i < witches.length; i++) {
    witches[i].continueAnimation()
  }
  for (let i = 0; i < starsElements.length; i++) {
    const state = starsElementsState[i]
    starsElements[i].style.animationPlayState = state
  }
  starsElements = []
  starsElementsState = []
  // loop through each demon object
  for (let i = 0; i < demons.length; i++) {
    // get the element associated with the current demon object
    const element = demons[i].element

    // check if the element has the animation class
    const hasAnimationClass =
      element.classList.contains("enemy1") ||
      element.classList.contains("enemy2") ||
      element.classList.contains("enemy3")

    if (hasAnimationClass) {
      // if the animation has started, retrieve the saved animation state from the animationState array
      const state = animationState[i]

      // continue the animation from where it was paused
      element.style.animationPlayState = state
    }
  }
  for (let i = 0; i < pausedCases.length; i++) {
    pausedCases[i].demonMovementAnimation()
  }
  pausedCases = []
  // loop through each meteor object
  for (let i = 0; i < meteors.length; i++) {
    // get the element associated with the current meteor object
    const element = meteors[i].element

    // check if the element has the animation class
    const hasAnimationClass =
      element.classList.contains("meteor1") ||
      element.classList.contains("meteor2")

    if (hasAnimationClass) {
      // if the animation has started, retrieve the saved animation state from the animationState array
      const state = meteorAnimationState[i]

      // continue the animation from where it was paused
      element.style.animationPlayState = state
    }
  }
  if (coin.coinIsActive) {
    coin.element.style.animationPlayState = coinAnimationState
  }
  const witchShots = document.querySelectorAll(".witchShot")
  const witchShotElements = []
  if (witchShots.length > 0) {
    for (let i = 0; i < witchShots.length; i++) {
      witchShots[i].style.animationPlayState = "running"
      witchShotElements.push(witchShots[i])
    }
  }
  if (phase3Active) {
    bossArray[0].element.style.animationPlayState = ""
    if (phase3Active) {
      if (bossArray[0].onLeftSide) {
        bossArray[0].leftSideAnimation()
      } else {
        bossArray[0].rightSideAnimation()
      }
      for (let i = 0; i < bossShotsArray.length; i++) {
        bossArray[0].continueShots(bossShotsArray[i])
      }
      clearTimeout(bossAttackPatternTimeout)
      bossAttackPatternTimeout = setTimeout(() => {
        if (bossArray[0].attackPatternActive == false) {
          bossArray[0].attackPattern()
        }
      }, 2501)
    }
  }
  if (superShotsBeingUsed) {
    callSuperShotsTimeout(superShotsTimeLeft)
  }
}
function quitGame() {
  const quitText = document.getElementById("quitText")
  const spanInside = document.getElementById("quitTextSpan")
  const originalFontSize = quitText.style.fontSize
  const originalColor = quitText.style.color
  const originalCursor = quitText.style.cursor
  const originalText = quitText.innerText
  spanInside.removeAttribute("onclick")

  quitText.style.fontSize = "1em"
  quitText.style.color = "#E75757"
  quitText.style.cursor = "default"
  spanInside.innerText = "are you sure you want to quit?"

  const cancelDiv = document.createElement("div")
  const yesButton = document.createElement("span")
  const noButton = document.createElement("span")

  yesButton.innerText = "yes"
  noButton.innerText = "no"

  const onYesButtonClick = () => {
    bottle.hp = 0
    bottle.checkHp(bottle.maxHp)
    hpTableSet = false
    gamePausedDiv.style.top = "-75%"
    resetQuitDiv()
  }

  function resetQuitDiv() {
    // Remove event listeners
    yesButton.removeEventListener("click", onYesButtonClick)
    noButton.removeEventListener("click", resetQuitDiv)
    quitText.removeChild(cancelDiv)
    // Restore the original state
    quitText.style.fontSize = originalFontSize
    quitText.style.color = originalColor
    quitText.style.cursor = originalCursor
    spanInside.innerText = originalText
    spanInside.setAttribute("onclick", "quitGame()")
  }

  yesButton.addEventListener("click", onYesButtonClick)
  noButton.addEventListener("click", resetQuitDiv)

  cancelDiv.classList.add("cancel-div")
  yesButton.classList.add("yes-button")
  noButton.classList.add("no-button")

  cancelDiv.appendChild(yesButton)
  cancelDiv.appendChild(noButton)
  quitText.appendChild(cancelDiv)
}

//UI UX functions
function createGuest() {
  if (popUpExists) {
    return
  }
  user = new User()
  user.createGuest()
  isLogged = true
}
function loggedIn() {
  if (popUpExists) {
    return
  }
  showUserName()
  playButton.style.bottom = "15%"
  document.getElementById("notLoggedDiv").style.bottom = "-40%"
}
function showUI() {
  if (isLogged) {
    playButton.style.bottom = "15%"
    document.getElementById("userNameDiv").style.left = "1%"
  } else {
    document.getElementById("notLoggedDiv").style.bottom = "5%"
  }
  platformImg.style.bottom = "30%"
  document.getElementById("shopDiv").style.left = "2.5%"
  document.getElementById("loadoutDiv").style.left = "2.5%"
  document.getElementById("missionsDiv").style.left = "2.5%"
  document.getElementById("muteDiv").style.right = "2.5%"
  document.getElementById("settingsDiv").style.right = "2.5%"
}
window.addEventListener("load", () => {
  showUI()
})
function hideUI(userNameStays) {
  playButton.style.bottom = "-20%"
  document.getElementById("notLoggedDiv").style.bottom = "-40%"
  document.getElementById("shopDiv").style.left = "-15%"
  document.getElementById("loadoutDiv").style.left = "-15%"
  document.getElementById("missionsDiv").style.left = "-15%"
  document.getElementById("muteDiv").style.right = "-15%"
  document.getElementById("settingsDiv").style.right = "-15%"
  if (!userNameStays) {
    document.getElementById("userNameDiv").style.left = "-20%"
  }
}
function showSignUp() {
  showUI()
  isLogged = false
  user = null
  bottle.img.src = "https://i.imgur.com/Og88sMT.png"
  shotsSRC = "https://i.imgur.com/HfRYTkp.png"
  const existingUserNameDiv = document.getElementById("userNameDiv")
  if (existingUserNameDiv) {
    existingUserNameDiv.style.opacity = "0"
    setTimeout(() => {
      container.removeChild(existingUserNameDiv)
    }, 1000)
  }
  playButton.style.bottom = "-20%"
  document.getElementById("notLoggedDiv").style.bottom = "5%"
}
function backAfterGameOver() {
  document.getElementById("gameOverDiv").style.top = "-75%"
  document.getElementById("scoreDiv").innerText = ""
  document.getElementById("hpDiv").style.visibility = "hidden"
  showUI()
}
function showUserName() {
  const userNameDiv = document.createElement("div")
  userNameDiv.style.position = "absolute"
  userNameDiv.style.opacity = "0"
  userNameDiv.id = "userNameDiv"
  const pfPic = document.createElement("img")
  const nameText = document.createElement("p")
  const logOutOrCreateAccPic = document.createElement("img")
  const logOutOrCreateAccText = document.createElement("p")
  logOutOrCreateAccPic.src = "https://i.ibb.co/P6rLXjC/doorknob.png"
  logOutOrCreateAccText.style.cursor = "pointer"
  logOutOrCreateAccText.setAttribute("onclick", "showSignUp()")
  if (user.isGuest) {
    logOutOrCreateAccText.innerText = "create account"
  } else {
    logOutOrCreateAccText.innerText = "log out"
  }
  pfPic.src = "https://i.ibb.co/qFjYWQD/group-1.png"
  nameText.innerText = user.userName

  pfPic.className = "pf-pic"
  nameText.className = "user-name-text"
  logOutOrCreateAccPic.className = "log-out-pic"
  logOutOrCreateAccText.className = "log-out-text"

  userNameDiv.appendChild(pfPic)
  userNameDiv.appendChild(nameText)
  userNameDiv.appendChild(logOutOrCreateAccPic)
  userNameDiv.appendChild(logOutOrCreateAccText)

  container.appendChild(userNameDiv)
  setTimeout(() => {
    userNameDiv.style.opacity = "1"
  }, 10)
}
function signUp() {
  document.getElementById("notLoggedDiv").style.bottom = "-40%"
  const signUpForm = document.createElement("form")
  const formUserName = document.createElement("input")
  const formPassword = document.createElement("input")
  const formEmail = document.createElement("input")
  const formSignUp = document.createElement("input")
  const formCancel = document.createElement("input")

  signUpForm.className = "sign-up-form"
  formUserName.className = "sign-up-inputs"
  formPassword.className = "sign-up-inputs"
  formEmail.className = "sign-up-inputs"
  formSignUp.className = "sign-up-buttons"
  formCancel.className = "sign-up-buttons"

  formUserName.style.top = "0"
  formPassword.style.top = "0"
  formUserName.style.left = "11.75%"
  formPassword.style.left = "51.5%"
  formUserName.style.width = "35%"
  formPassword.style.width = "35%"
  formEmail.style.top = "27.5%"
  formEmail.style.width = "75%"
  formSignUp.style.top = "55%"
  formCancel.style.top = "82.5%"
  formCancel.style.border = "4px solid #38484E"
  formUserName.type = "text"
  formPassword.type = "password"
  formEmail.type = "text"
  formSignUp.type = "submit"

  formUserName.placeholder = "username"
  formPassword.placeholder = "password"
  formEmail.placeholder = "email"
  formSignUp.value = "sign up"

  formCancel.type = "button"
  formCancel.value = "cancel"
  formCancel.addEventListener("click", cancelSignUp)

  signUpForm.appendChild(formUserName)
  signUpForm.appendChild(formPassword)
  signUpForm.appendChild(formEmail)
  signUpForm.appendChild(formSignUp)
  signUpForm.appendChild(formCancel)

  container.appendChild(signUpForm)
  setTimeout(() => {
    signUpForm.style.bottom = "5%"
  }, 10)
  signUpForm.addEventListener("submit", handleSignUp)

  function cancelSignUp() {
    formCancel.removeEventListener("click", cancelSignUp)
    signUpForm.removeEventListener("submit", handleSignUp)
    document.getElementById("notLoggedDiv").style.bottom = "5%"
    signUpForm.style.bottom = "-50%"
    setTimeout(() => {
      signUpForm.remove()
    }, 501)
  }
  function handleSignUp(event) {
    event.preventDefault()
    if (popUpExists) {
      return
    }
    const userName = formUserName.value.trim()
    const password = formPassword.value.trim()
    const email = formEmail.value.trim()
    //validation
    if (!userName || !password || !email) {
      popUper(
        "you must fill up user name, password, and an email to complete sign up!"
      )
      return
    }
    if (userName.length < 3) {
      popUper("user name must have at least 3 characters!")
      return
    }
    if (password.length < 4) {
      popUper("password field must have at least 4 characters!")
      return
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      popUper("email incorrect")
      return
    }

    // after validation sign user up from server
    const userData = {
      userName: userName,
      password: password,
      email: email,
    }
    fetch("http://localhost:3000/api/register/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            throw new Error(data.error)
          })
        }
        return response.json()
      })
      .then((data) => {
        if (data.success) {
          signUpForm.style.bottom = "-50%"
          setTimeout(() => {
            signUpForm.remove()
          }, 501)
          formCancel.removeEventListener("click", cancelSignUp)
          signUpForm.removeEventListener("submit", handleSignUp)
          user = new User()
          user.isGuest = false
          user.userName = data.user.userName
          user.mail = data.user.email
          user.token = data.user.token
          isLogged = true
          showUserName()
          showUI()
        } else {
          // Failed to register user
          // Display an error message or alert to the user
        }
      })
      .catch((error) => {
        popUper(error.message)
      })
  }
}
function logIn() {
  document.getElementById("notLoggedDiv").style.bottom = "-40%"
  const signUpForm = document.createElement("form")
  const formUserName = document.createElement("input")
  const formPassword = document.createElement("input")
  const formSignUp = document.createElement("input")
  const formCancel = document.createElement("input")

  signUpForm.className = "sign-up-form"
  formUserName.className = "sign-up-inputs"
  formPassword.className = "sign-up-inputs"
  formSignUp.className = "sign-up-buttons"
  formCancel.className = "sign-up-buttons"

  formUserName.style.top = "0"
  formPassword.style.top = "27.5%"
  formUserName.style.width = "75%"
  formPassword.style.width = "75%"
  formSignUp.style.top = "55%"
  formCancel.style.top = "82.5%"
  formCancel.style.border = "4px solid #38484E"
  formUserName.type = "text"
  formPassword.type = "password"
  formSignUp.type = "submit"

  formUserName.placeholder = "username or email"
  formPassword.placeholder = "password"
  formSignUp.value = "log in"

  formCancel.type = "button"
  formCancel.value = "cancel"
  formCancel.addEventListener("click", cancelLogIn)

  signUpForm.appendChild(formUserName)
  signUpForm.appendChild(formPassword)
  signUpForm.appendChild(formSignUp)
  signUpForm.appendChild(formCancel)

  container.appendChild(signUpForm)
  setTimeout(() => {
    signUpForm.style.bottom = "5%"
  }, 10)
  signUpForm.addEventListener("submit", handleLogIn)

  function cancelLogIn() {
    formCancel.removeEventListener("click", cancelLogIn)
    signUpForm.removeEventListener("submit", handleLogIn)
    document.getElementById("notLoggedDiv").style.bottom = "5%"
    signUpForm.style.bottom = "-50%"
    setTimeout(() => {
      signUpForm.remove()
    }, 501)
  }
  function handleLogIn(event) {
    event.preventDefault()
    if (popUpExists) {
      return
    }
    const userName = formUserName.value.trim()
    const password = formPassword.value.trim()
    //validation
    if (!userName || !password) {
      popUper("you must fill up all the fields to complete log in!")
      return
    }
    if (userName.length < 3) {
      popUper("user name must have at least 3 characters!")
      return
    }
    if (password.length < 4) {
      popUper("password field must have at least 4 characters!")
      return
    }
    // after validation sign user up from server
    const userData = {
      input: userName,
      password: password,
    }
    fetch("http://localhost:3000/api/register/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    })
      .then((response) => {
        if (!response.ok) {
          return response.json().then((data) => {
            console.log("data:", data)
            throw new Error(data.message)
          })
        }
        return response.json()
      })
      .then((data) => {
        if (data.success) {
          signUpForm.style.bottom = "-50%"
          setTimeout(() => {
            signUpForm.remove()
          }, 501)
          formCancel.removeEventListener("click", cancelLogIn)
          signUpForm.removeEventListener("submit", handleLogIn)
          user = new User()
          user.logUserIn(data.user)
          isLogged = true
          showUserName()
          showUI()
        } else {
          // Failed to register user
          // Display an error message or alert to the user
        }
      })
      .catch((error) => {
        console.log(error)
        popUper(error.message)
      })
  }
}
function popUper(popUpText) {
  // playSound(soundFXvolume , '/sounds/popup.wav');
  const popUpDivs = container.getElementsByClassName("pop-up-div")
  if (popUpDivs.length > 0) {
    const existingBackSpan = popUpDivs[0].querySelector(".pop-up-div-back")
    existingBackSpan.removeEventListener(
      "click",
      existingBackSpan.handleBackClick
    )
    popUpDivs[0].remove()
  }
  const popUpDiv = document.createElement("div")
  const textSpanContainer = document.createElement("div")
  const textSpan = document.createElement("span")
  const backSpan = document.createElement("span")

  popUpDiv.className = "pop-up-div"
  textSpanContainer.className = "pop-up-error-container"
  textSpan.className = "pop-up-div-text"
  backSpan.className = "pop-up-div-back"

  textSpan.innerText = popUpText
  backSpan.innerText = "go back"

  textSpanContainer.appendChild(textSpan)
  popUpDiv.appendChild(textSpanContainer)
  popUpDiv.appendChild(backSpan)
  container.appendChild(popUpDiv)
  popUpExists = true

  function handleBackClick() {
    popUpDiv.remove()
    backSpan.removeEventListener("click", handleBackClick)
    popUpExists = false
  }

  // Attach the click event listener to backSpan
  backSpan.addEventListener("click", handleBackClick)
  backSpan.handleBackClick = handleBackClick
}
function showShop() {
  if (popUpExists) {
    return
  }
  if (!isLogged) {
    popUper("please log in or play as guest to use this option")
    return
  }
  hideUI(true)
  // playSound(soundFXvolume , '/sounds/swooz.wav');
  let createAccountElement = document.querySelector(".log-out-text")
  const buyButtonEventListeners = []
  const showBuyButtonEventListeners = []
  const hideBuyButtonEventListeners = []

  const shopDivContainer = document.createElement("div")
  const shopHeader = document.createElement("span")
  const userCoinsDiv = document.createElement("div")
  const userCoins = document.createElement("span")
  const userCoinsImg = document.createElement("img")
  shopDivContainer.className = "shop-div-container"
  shopHeader.className = "shop-header"
  shopHeader.innerText = "shop"
  userCoins.innerText = user.coins
  userCoinsImg.src = "https://i.ibb.co/Mnrrzgg/dollar.png"
  userCoinsImg.className = "shop-user-coin-img"
  userCoinsDiv.className = "shop-user-coins"
  userCoinsDiv.appendChild(userCoinsImg)
  userCoinsDiv.appendChild(userCoins)
  shopDivContainer.appendChild(userCoinsDiv)
  shopDivContainer.appendChild(shopHeader)
  // inner function
  function buyItem(
    itemID,
    itemCost,
    element,
    shotSrc,
    loadoutSrc,
    coinDiv,
    bottleSrc,
    bottleImg
  ) {
    if (popUpExists) {
      return
    }
    if (itemCost > user.coins) {
      popUper("not enough coins!")
      return
    }
    let newBottleData
    if (element) {
      newBottleData = {
        name: itemID,
        src: loadoutSrc,
        shotSrc: shotSrc,
        realSrc: bottleSrc,
      }
    } else {
      newBottleData = { name: itemID }
    }
    const token = user.token
    fetch("http://localhost:3000/api/game/buyitem", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemID, newBottleData }),
    })
      .then((response) => response.json())
      .then((data) => {
        user.coins = user.coins - itemCost
        userCoins.innerText = user.coins
        if (element) {
          //   playSound(soundFXvolume , '/sounds/boughtbottle.wav');
          element.style.display = "none"
          element.style.visibility = "hidden"
          let imgElement = coinDiv.querySelector("img")
          let spanElement = coinDiv.querySelector("span")
          imgElement.src = "https://i.ibb.co/L0hZ44d/v-2.png"
          spanElement.style.color = "#FFFFFF"
          spanElement.innerText = "owned"
          bottleImg.classList.add("shadow-animation")
          setTimeout(() => {
            bottleImg.classList.remove("shadow-animation")
          }, 500)
          user.bottlesOwned.push(newBottleData)
        } else {
          //   playSound(soundFXvolume * 0.5 , '/sounds/buypwp.wav');
          let currentNumPre = shotSrc.innerText
          let numStr = currentNumPre.slice("owned: ".length)
          let currentNum = parseInt(numStr)
          currentNum++
          shotSrc.innerText = "owned: " + currentNum
          for (let i = 0; i < user.userPowerups.length; i++) {
            if (user.userPowerups[i].name == itemID) {
              user.userPowerups[i].owned++
              break
            }
          }
        }
      })
      .catch((error) => {
        console.error(error) // Handle any errors
      })
  }

  //Powerups section
  const powerupsInfo = [
    {
      id: "bottleFlip", // 1
      source: "https://i.ibb.co/VY18z1P/Mask-group-1.png",
      name: "bottle flip",
      info: "bottle goes invincible for 3 seconds and performs a flip that eliminates all enemies",
      price: "3",
      owned: user.userPowerups[0].owned,
      left: "2.5%",
    },
    {
      id: "superShots", // 2
      source: "https://i.ibb.co/sQjMKLT/Group-22-2.png",
      name: "super shots",
      info: "your shots are bigger and cause more damage for 30 seconds",
      price: "3",
      owned: user.userPowerups[1].owned,
      left: "35%",
    },
    {
      id: "shield", // 3
      source: "https://i.ibb.co/C2F7c5g/Group-22-3.png",
      name: "shield",
      info: "cant get hit while pressing down the hotkey total time: 15s",
      price: "3",
      owned: user.userPowerups[2].owned,
      left: "67.5%",
    },
  ]

  const powerupSectionDiv = document.createElement("div")
  const powerupsHeader = document.createElement("span")

  powerupsHeader.innerText = "powerups"
  powerupSectionDiv.className = "powerups-section"
  powerupsHeader.className = "powerups-header"
  powerupSectionDiv.appendChild(powerupsHeader)

  function buyItemEventHandler(id, cost, state, element) {
    buyItem(id, cost, state, element)
  }
  for (let i = 0; i < powerupsInfo.length; i++) {
    const powerupDiv = document.createElement("div")
    const powerupImg = document.createElement("img")
    const powerupHeader = document.createElement("span")
    const powerupText = document.createElement("span")
    const costDiv = document.createElement("div")
    const coinIcon = document.createElement("img")
    const costText = document.createElement("span")
    const buyButton = document.createElement("div")
    const buyText = document.createElement("span")
    const ownedText = document.createElement("span")

    coinIcon.src = "https://i.ibb.co/Mnrrzgg/dollar.png"
    powerupImg.src = powerupsInfo[i].source
    powerupHeader.innerText = powerupsInfo[i].name
    powerupText.innerText = powerupsInfo[i].info
    costText.innerText = powerupsInfo[i].price
    ownedText.innerText = "owned: " + powerupsInfo[i].owned
    buyText.innerText = "buy"

    powerupHeader.className = "powerup-header"
    powerupDiv.className = "powerup-div"
    powerupImg.className = "powerup-image"
    powerupText.className = "powerup-info"
    costDiv.className = "powerups-cost-div"
    costText.className = "powerups-cost-text"
    coinIcon.className = "powerups-cost-img"
    buyButton.className = "powerups-buy-button"
    buyText.className = "powerups-buy-text"
    ownedText.className = "powerups-owned-text"
    powerupDiv.style.left = powerupsInfo[i].left

    const eventListener = () =>
      buyItemEventHandler(
        powerupsInfo[i].name,
        powerupsInfo[i].price,
        false,
        ownedText
      )
    buyButtonEventListeners.push(eventListener)
    buyButton.addEventListener("click", eventListener)

    costDiv.appendChild(coinIcon)
    costDiv.appendChild(costText)
    buyButton.appendChild(buyText)

    powerupDiv.appendChild(powerupImg)
    powerupDiv.appendChild(powerupHeader)
    powerupDiv.appendChild(powerupText)
    powerupDiv.appendChild(costDiv)
    powerupDiv.appendChild(buyButton)
    powerupDiv.appendChild(ownedText)

    powerupSectionDiv.appendChild(powerupDiv)
  } // end of for loop for powerups
  shopDivContainer.appendChild(powerupSectionDiv)

  // bottles section
  const bottlesInfo = [
    {
      id: "whiskey",
      source: "https://i.imgur.com/slNQXJf.png",
      name: "whiskey",
      price: "20",
      owned: false,
      shotSrc: "https://i.imgur.com/myO9Jgq.png",
      loadoutSrc: "https://i.imgur.com/RMIKUMA.png",
    },
    {
      id: "wine",
      source: "https://i.imgur.com/TmP4dQN.png",
      name: "wine",
      price: "20",
      owned: false,
      shotSrc: "https://i.imgur.com/QGkD1hv.png",
      loadoutSrc: "https://i.imgur.com/Okuz7Zv.png",
    },
    {
      id: "beer",
      source: "https://i.imgur.com/ZlHxqZO.png",
      name: "beer",
      price: "40",
      owned: false,
      shotSrc: "https://i.imgur.com/Me9jhxm.png",
      loadoutSrc: "https://i.imgur.com/aJDeYLy.png",
    },
    {
      id: "cola",
      source: "https://i.imgur.com/fo7qiaR.png",
      name: "cola",
      price: "50",
      owned: false,
      shotSrc: "https://i.imgur.com/UE0TDWa.png",
      loadoutSrc: "https://i.imgur.com/X27Ungm.png",
    },
    {
      id: "champagne",
      source: "https://i.imgur.com/ZRRvIHa.png",
      name: "champagne",
      price: "80",
      owned: false,
      shotSrc: "https://i.imgur.com/3o5tVFq.png",
      loadoutSrc: "https://i.imgur.com/3mbUj9W.png",
    },
    {
      id: "genieBottle",
      source: "https://i.imgur.com/ine5WBq.png",
      name: "genie lamp",
      price: "100",
      owned: false,
      shotSrc: "https://i.imgur.com/JI02rvF.png",
      loadoutSrc: "https://i.imgur.com/QN3lUFJ.png",
    },
    {
      id: "brokenBottle",
      source: "https://i.imgur.com/8qzIGle.png",
      name: "broken bottle",
      price: "100",
      owned: false,
      shotSrc: "https://i.imgur.com/PubPqlO.png",
      loadoutSrc: "https://i.imgur.com/VsPgDOo.png",
    },
    {
      id: "lostBottle",
      source: "https://i.imgur.com/hgwcTZ0.png",
      name: "lost bottle",
      price: "100",
      owned: false,
      shotSrc: "https://i.imgur.com/wvHNN1t.png",
      loadoutSrc: "https://i.imgur.com/8AFJPG6.png",
    },
    {
      id: "loveBottle",
      source: "https://i.imgur.com/VGEvQLi.png",
      name: "love bottle",
      price: "150",
      owned: false,
      shotSrc: "https://i.imgur.com/cc3U4pZ.png",
      loadoutSrc: "https://i.imgur.com/MFodFIS.png",
    },
  ]
  let bottleContainerTotalWidth = 0
  for (let i = 0; i < bottlesInfo.length; i++) {
    if (i === 0 || i === bottlesInfo.length - 1) {
      bottleContainerTotalWidth += 15
    } else {
      bottleContainerTotalWidth += 20
    }
  }
  const bottlesSectionDiv = document.createElement("div")
  const bottlesHeader = document.createElement("span")
  const bottlesVisibleContainer = document.createElement("div")
  const containerForBottles = document.createElement("div")
  const slideLeftButton = document.createElement("div")
  const slideRightButton = document.createElement("div")

  bottlesHeader.innerText = "bottles"
  bottlesSectionDiv.className = "bottles-div-container"
  bottlesHeader.className = "bottles-header"
  bottlesVisibleContainer.className = "bottles-visible-container"
  containerForBottles.className = "bottles-container"
  slideLeftButton.className = "bottles-left-button"
  slideRightButton.className = "bottles-right-button"

  function slideBottles(direction) {
    if (bottlesContainerSliding) {
      return
    }
    bottlesContainerSliding = true

    const computedStyle = window.getComputedStyle(containerForBottles)
    const currentLeft = parseFloat(computedStyle.left)
    const speed = 200
    if (direction == "left") {
      const leftProperty = computedStyle.left
      if (leftProperty === "0px") {
        return
      }
      const targetLeft = 0
      const distance = Math.abs(targetLeft - currentLeft)
      const duration = distance / speed
      containerForBottles.style.transition = `left ${duration}s linear`
      containerForBottles.style.left = "0px"
    } else if (direction == "right") {
      const targetLeft = -containerForBottles.offsetWidth
      const distance = Math.abs(targetLeft - currentLeft)
      const duration = distance / speed
      containerForBottles.style.transition = `left ${duration}s linear`
      containerForBottles.style.left = `${targetLeft}px`
    }
  }
  let animationFrame
  function stopSlideBottles() {
    bottlesContainerSliding = false
    containerForBottles.style.transition = "left 0s linear"
    const computedStyle = window.getComputedStyle(containerForBottles)
    const computedLeft = computedStyle.left
    if (animationFrame) {
      cancelAnimationFrame(animationFrame)
    }
    animationFrame = requestAnimationFrame(() => {
      containerForBottles.style.left = computedLeft
    })
  }
  function slideBottlesLeft() {
    slideBottles("left")
  }

  function slideBottlesRight() {
    slideBottles("right")
  }
  slideLeftButton.addEventListener("mouseenter", slideBottlesLeft)
  slideRightButton.addEventListener("mouseenter", slideBottlesRight)
  slideLeftButton.addEventListener("mouseleave", stopSlideBottles)
  slideRightButton.addEventListener("mouseleave", stopSlideBottles)

  containerForBottles.style.width = bottleContainerTotalWidth + "%"
  bottlesSectionDiv.appendChild(bottlesHeader)

  function showBuyButton(element, bottleImg) {
    if (popUpExists) {
      return
    }
    if (element.style.visibility == "hidden") {
      return
    }
    bottleImg.classList.add("bottle-float")
    element.classList.remove("bottle-buy-button-hide")
    element.style.display = "flex"
    element.classList.add("bottle-buy-button-show")
  }
  function hideBuyButton(element, bottleImg) {
    bottleImg.classList.remove("bottle-float")
    element.classList.remove("bottle-buy-button-show")
    element.classList.add("bottle-buy-button-hide")
    setTimeout(() => {
      element.style.display = "flex"
    }, 200)
  }

  let leftVal = 0
  for (let i = 0; i < bottlesInfo.length; i++) {
    for (let j = 0; j < user.bottlesOwned.length; j++) {
      if (bottlesInfo[i].name === user.bottlesOwned[j].name) {
        bottlesInfo[i].owned = true
        break
      }
    }

    const divForBottle = document.createElement("div")
    const bottleImg = document.createElement("img")
    const platformImg = document.createElement("img")
    const bottleText = document.createElement("span")
    const costDiv = document.createElement("div")
    const coinIcon = document.createElement("img")
    const costText = document.createElement("span")
    const buyButton = document.createElement("div")
    const buyText = document.createElement("span")

    bottleImg.src = bottlesInfo[i].loadoutSrc
    bottleText.innerText = bottlesInfo[i].name
    bottleText.innerText = bottlesInfo[i].name
    costText.innerText = bottlesInfo[i].price
    platformImg.src = "https://i.ibb.co/41rFf7w/blue-Scale.png"
    buyText.innerText = "buy"
    if (bottlesInfo[i].owned == true) {
      coinIcon.src = "https://i.ibb.co/L0hZ44d/v-2.png"
      costText.style.color = "#FFFFFF"
      costText.innerText = "owned"
      buyButton.style.visibility = "hidden"
    } else {
      coinIcon.src = "https://i.ibb.co/Mnrrzgg/dollar.png"
      costText.innerText = bottlesInfo[i].price
    }

    divForBottle.className = "shop-bottle-div"
    bottleImg.className = "shop-bottle-image"
    platformImg.className = "shop-bottle-platform"
    bottleText.className = "shop-bottle-name"
    costDiv.className = "bottle-cost-div"
    costText.className = "bottle-cost-text"
    coinIcon.className = "bottle-cost-img"
    buyButton.className = "bottle-buy-button"
    buyText.className = "bottle-buy-text"
    if (i === 0) {
      divForBottle.style.left = "0vw"
    } else {
      leftVal += 15
      divForBottle.style.left = leftVal + "vw"
    }

    const buyEventListener = () =>
      buyItem(
        bottlesInfo[i].name,
        bottlesInfo[i].price,
        buyButton,
        bottlesInfo[i].shotSrc,
        bottlesInfo[i].loadoutSrc,
        costDiv,
        bottlesInfo[i].source,
        bottleImg
      )
    const showBuyButtonListener = () => showBuyButton(buyButton, bottleImg)
    const hideBuyButtonListener = () => hideBuyButton(buyButton, bottleImg)

    buyButtonEventListeners.push(buyEventListener)
    showBuyButtonEventListeners.push(showBuyButtonListener)
    hideBuyButtonEventListeners.push(hideBuyButtonListener)

    buyButton.addEventListener("click", buyEventListener)
    divForBottle.addEventListener("mouseenter", showBuyButtonListener)
    divForBottle.addEventListener("mouseleave", hideBuyButtonListener)

    costDiv.appendChild(coinIcon)
    costDiv.appendChild(costText)
    buyButton.appendChild(buyText)
    divForBottle.appendChild(bottleImg)
    divForBottle.appendChild(platformImg)
    divForBottle.appendChild(bottleText)
    divForBottle.appendChild(costDiv)
    divForBottle.appendChild(buyButton)

    containerForBottles.appendChild(divForBottle)
  }
  bottlesSectionDiv.appendChild(slideLeftButton)
  bottlesSectionDiv.appendChild(slideRightButton)
  bottlesVisibleContainer.appendChild(containerForBottles)
  bottlesSectionDiv.appendChild(bottlesVisibleContainer)
  shopDivContainer.appendChild(bottlesSectionDiv)

  //return button
  const shopReturnButton = createReturnHomeButton()
  shopReturnButton.style.position = "absolute"
  shopReturnButton.style.left = "50%"
  shopReturnButton.style.transform = "translateX(-50%)"
  shopReturnButton.addEventListener("click", closeShop)

  function closeShop() {
    shopReturnButton.removeEventListener("click", closeShop)
    createAccountElement.removeEventListener("click", closeShop)

    slideLeftButton.removeEventListener("mouseenter", slideBottlesLeft)
    slideRightButton.removeEventListener("mouseenter", slideBottlesRight)
    slideLeftButton.removeEventListener("mouseleave", stopSlideBottles)
    slideRightButton.removeEventListener("mouseleave", stopSlideBottles)

    const buyButtons = document.querySelectorAll(
      ".powerups-buy-button, .bottle-buy-button"
    )
    const divForBottles = document.getElementsByClassName("shop-bottle-div") // Replace with the appropriate class name
    for (let i = 0; i < buyButtons.length; i++) {
      buyButtons[i].removeEventListener("click", buyButtonEventListeners[i])
    }
    for (let i = 0; i < divForBottles.length; i++) {
      divForBottles[i].removeEventListener(
        "mouseenter",
        showBuyButtonEventListeners[i]
      )
      divForBottles[i].removeEventListener(
        "mouseleave",
        hideBuyButtonEventListeners[i]
      )
    }
    shopDivContainer.style.top = "-100%"
    shopReturnButton.style.top = "-30%"
    setTimeout(() => {
      shopDivContainer.remove()
      shopReturnButton.remove()
    }, 500)
    showUI()
  }
  createAccountElement.addEventListener("click", closeShop)
  container.appendChild(shopReturnButton)
  shopDivContainer.style.top = "-100%"
  container.appendChild(shopDivContainer)
  setTimeout(() => {
    shopDivContainer.style.top = "50%"
    shopReturnButton.style.top = "calc(100% - 7.5% - 5%)" // 100% (full container height) - 7.5% (height of the button) - 5% (desired bottom offset)
  }, 10)
}
function showSettings() {
  if (popUpExists) {
    return
  }
  if (!isLogged) {
    popUper("please log in or play as guest to use this option")
    return
  }
  hideUI(true)
  //playSound(soundFXvolume , '/sounds/swooz.wav');

  let createAccountElement = document.querySelector(".log-out-text")
  const hotkeysEventListenerArray = []
  const resolutionEventListenerArray = []
  const inputsEventListenerArray = []

  const settingsDivContainer = document.createElement("div")
  const settingsHeader = document.createElement("span")
  const infoHeader = document.createElement("span")
  settingsDivContainer.className = "settings-div-container"
  settingsHeader.className = "settings-headers"
  infoHeader.className = "settings-headers"
  settingsDivContainer.appendChild(settingsHeader)
  settingsDivContainer.appendChild(infoHeader)
  settingsDivContainer.style.top = "-100%"
  settingsHeader.innerText = "settings"
  infoHeader.innerText = "info"
  settingsHeader.style.left = "10%"
  infoHeader.style.left = "65%"
  settingsHeader.classList.add("settings-chosen-header")
  const settingsSection = document.createElement("div")
  settingsSection.className = "settings-section"
  const infoSection = document.createElement("div")
  infoSection.className = "info-section"

  function changeSettingsInfo(header) {
    settingsHeader.classList.remove("settings-chosen-header")
    infoHeader.classList.remove("settings-chosen-header")
    if (header == "info") {
      infoHeader.classList.add("settings-chosen-header")
      settingsSection.style.display = "none"
      infoSection.style.display = "block"
      settingsSection.style.pointerEvents = "none"
      infoSection.style.pointerEvents = ""
      infoHeader.removeEventListener("click", changeInfoHeader)
      settingsHeader.addEventListener("click", changeSettingsHeader)
    } else {
      settingsHeader.classList.add("settings-chosen-header")
      infoSection.style.display = "none"
      settingsSection.style.display = "block"
      infoSection.style.pointerEvents = "none"
      settingsSection.style.pointerEvents = ""

      infoHeader.addEventListener("click", changeInfoHeader)
      settingsHeader.removeEventListener("click", changeSettingsHeader)
    }
  }
  function changeInfoHeader() {
    changeSettingsInfo("info")
  }
  function changeSettingsHeader() {
    changeSettingsInfo("settings")
  }
  infoHeader.addEventListener("click", changeInfoHeader)
  // Info section
  const infoText = document.createElement("div")
  infoText.innerText = "contact me: xeliasfr@gmail.com"
  infoText.className = "settings-info-text"
  infoSection.appendChild(infoText)
  // Music & SoundFX section
  const soundFxDiv = document.createElement("div")
  const soundFxText = document.createElement("span")
  const soundFxInput = document.createElement("input")
  soundFxInput.type = "range"
  soundFxInput.max = 100
  soundFxDiv.className = "sound-fx-div"
  soundFxText.className = "settings-sub-headers"
  soundFxInput.className = "settings-inputs"
  soundFxText.innerText = "sound fx"
  soundFxDiv.appendChild(soundFxText)
  soundFxDiv.appendChild(soundFxInput)

  function changeVolume(volumeType, value, max) {
    const parsedValue = parseInt(value)
    const parsedMax = parseInt(max)
    const prePercentage = (parsedValue / parsedMax) * 100
    const percentage = Math.round(prePercentage)
    const finalVolume = percentage / 100
    console.log(volumeType, "percentage:", percentage)
    if (volumeType == "music") {
      musicVolume = finalVolume
    } else if (volumeType == "soundFX") {
      soundFXvolume = finalVolume
    }
  }

  const musicDiv = document.createElement("div")
  const musicText = document.createElement("span")
  const musicInput = document.createElement("input")
  musicInput.type = "range"
  musicInput.max = 100
  musicDiv.className = "music-div"
  musicText.className = "settings-sub-headers"
  musicInput.className = "settings-inputs"
  musicText.innerText = "music"
  musicDiv.appendChild(musicText)
  musicDiv.appendChild(musicInput)

  const soundFxEventListener = (event) => {
    changeVolume("soundFX", event.target.value, event.target.max)
  }
  const musicEventListener = (event) => {
    changeVolume("music", event.target.value, event.target.max)
  }
  inputsEventListenerArray.push(soundFxEventListener, musicEventListener)
  soundFxInput.addEventListener("click", soundFxEventListener)
  musicInput.addEventListener("click", musicEventListener)

  // Resolution section
  const resolutionDiv = document.createElement("div")
  const resolutionText = document.createElement("span")
  const innerResolutionDiv = document.createElement("div")
  const lowResDiv = document.createElement("div")
  const mediumResDiv = document.createElement("div")
  const highResDiv = document.createElement("div")

  resolutionDiv.className = "resolution-div"
  resolutionText.className = "settings-sub-headers"
  innerResolutionDiv.className = "inner-resolution-div"
  lowResDiv.className = "specific-resolution-div"
  mediumResDiv.className = "specific-resolution-div"
  highResDiv.className = "specific-resolution-div"
  resolutionText.innerText = "resolution"
  mediumResDiv.style.left = "33%"
  highResDiv.style.left = "66%"
  lowResDiv.style.borderRadius = "45px 0px 0px 45px"
  highResDiv.style.borderRadius = "0px 45px 45px 0px"
  lowResDiv.innerText = "low"
  mediumResDiv.innerText = "medium"
  highResDiv.innerText = "high"
  let userDefaultRes
  switch (user.resolutionPicked) {
    case "high":
      userDefaultRes = highResDiv
      break
    case "medium":
      userDefaultRes = mediumResDiv
      break
    case "low":
      userDefaultRes = lowResDiv
      break
    default:
      userDefaultRes = highResDiv
      break
  }
  userDefaultRes.classList.add("chosen-resolution")
  function changeRes(resolutionDiv, resolutionPicked) {
    lowResDiv.classList.remove("chosen-resolution")
    mediumResDiv.classList.remove("chosen-resolution")
    highResDiv.classList.remove("chosen-resolution")

    resolutionDiv.classList.add("chosen-resolution")
    user.resolutionPicked = resolutionPicked
  }

  const lowResEventListener = () => changeRes(lowResDiv, "low")
  const mediumResEventListener = () => changeRes(mediumResDiv, "medium")
  const highResEventListener = () => changeRes(highResDiv, "high")
  resolutionEventListenerArray.push(
    lowResEventListener,
    mediumResEventListener,
    highResEventListener
  )
  lowResDiv.addEventListener("click", lowResEventListener)
  mediumResDiv.addEventListener("click", mediumResEventListener)
  highResDiv.addEventListener("click", highResEventListener)

  innerResolutionDiv.appendChild(lowResDiv)
  innerResolutionDiv.appendChild(mediumResDiv)
  innerResolutionDiv.appendChild(highResDiv)
  resolutionDiv.appendChild(resolutionText)
  resolutionDiv.appendChild(innerResolutionDiv)

  // Key binds section
  const keyBindsDiv = document.createElement("div")
  const keyBindsText = document.createElement("span")
  const pwrupNames = ["bottle flip", "super shots", "shield"]
  const pwrupKeys = [
    user.userPowerups[0].hotkey,
    user.userPowerups[1].hotkey,
    user.userPowerups[2].hotkey,
  ]
  const columnIDs = ["bottleFlipColumn", "superShotsColumn", "shieldColumn"]
  // create table for pwrup key binds section
  function createWrapper(content) {
    const wrapper = document.createElement("div")
    wrapper.className = "td-content-wrapper"
    wrapper.appendChild(content)
    return wrapper
  }
  const pwrupNamesContainer = document.createElement("table")
  const pwrupNamesTR = document.createElement("tr")
  for (let i = 0; i < pwrupNames.length; i++) {
    const newTd = document.createElement("td")
    newTd.innerText = pwrupNames[i]
    pwrupNamesTR.appendChild(newTd)
  }
  const pwrupKeysTR = document.createElement("tr")
  function changeKeyBindPre(columnID) {
    const theTD = document.getElementById(columnID + "changeActive")
    theTD.classList.add("key-swap-alert")
    theTD.innerText = "press any key to change or ‘esc’ to cancel"
    let ignoreFirstClick = true
    function handleKeyDown(event) {
      const key = event.key
      if (key == "Escape") {
        removeEventListeners()
        return
      }
      changeKeyBind(columnID, key)
      removeEventListeners()
    }
    function handleClick() {
      if (ignoreFirstClick) {
        ignoreFirstClick = false
        return
      }
      ignoreFirstClick = false
      removeEventListeners()
    }
    function removeEventListeners() {
      document.removeEventListener("keydown", handleKeyDown)
      document.removeEventListener("click", handleClick)
      document.getElementById(columnID + "changeActive").innerText = ""
      document
        .getElementById(columnID + "changeActive")
        .classList.remove("key-swap-alert")
    }
    document.addEventListener("keydown", handleKeyDown)
    document.addEventListener("click", handleClick)
  }
  function changeKeyBind(columnID, pressedKey) {
    if (
      pressedKey == user.userPowerups[0].hotkey ||
      pressedKey == user.userPowerups[1].hotkey ||
      pressedKey == user.userPowerups[2].hotkey
    ) {
      popUper("key already in use")
      return
    }
    const theDiv = document.getElementById(columnID)
    theDiv.innerText = pressedKey
    if (columnID == columnIDs[0]) {
      user.userPowerups[0].hotkey = pressedKey
    } else if (columnID == columnIDs[1]) {
      user.userPowerups[1].hotkey = pressedKey
    } else if (columnID == columnIDs[2]) {
      user.userPowerups[2].hotkey = pressedKey
    }
  }
  for (let i = 0; i < pwrupNames.length; i++) {
    const newTd = document.createElement("td")
    const newKeyDiv = document.createElement("div")
    newKeyDiv.className = "settings-pwrup-key"
    newKeyDiv.innerText = user.userPowerups[i].hotkey
    newKeyDiv.id = columnIDs[i]
    const hotkeysEventListener = () => changeKeyBindPre(columnIDs[i])
    hotkeysEventListenerArray.push(hotkeysEventListener)
    newKeyDiv.addEventListener("click", hotkeysEventListener)
    newTd.appendChild(createWrapper(newKeyDiv)) // Wrap the element in the wrapper div
    pwrupKeysTR.appendChild(newTd)
  }
  const pwrupChangeActiveTR = document.createElement("tr")
  for (let i = 0; i < pwrupNames.length; i++) {
    const newTd = document.createElement("td")
    newTd.innerText = ""
    newTd.classList.add("padder-class")
    newTd.style.fontSize = "0.75em"
    newTd.style.color = "#FF9595"
    newTd.id = columnIDs[i] + "changeActive"
    pwrupChangeActiveTR.appendChild(newTd)
  }
  pwrupNamesContainer.appendChild(pwrupNamesTR)
  pwrupNamesContainer.appendChild(pwrupKeysTR)
  pwrupNamesContainer.appendChild(pwrupChangeActiveTR)

  keyBindsDiv.className = "key-binds-div"
  keyBindsText.className = "settings-sub-headers"
  pwrupNamesContainer.className = "settings-pwrup-name"
  keyBindsText.innerText = "powerups key binds"

  keyBindsDiv.appendChild(keyBindsText)
  keyBindsDiv.appendChild(pwrupNamesContainer)

  //return button
  const settingsReturnButton = createReturnHomeButton()
  settingsReturnButton.style.position = "absolute"
  settingsReturnButton.style.removeProperty("top")
  settingsReturnButton.style.left = "50%"
  settingsReturnButton.style.top = "-30%"
  settingsReturnButton.style.transform = "translateX(-50%)"
  settingsReturnButton.addEventListener("click", closeSettings)

  function closeSettings() {
    settingsReturnButton.removeEventListener("click", closeSettings)
    createAccountElement.removeEventListener("click", closeSettings)
    infoHeader.removeEventListener("click", changeInfoHeader)
    settingsHeader.removeEventListener("click", changeSettingsHeader)

    const hotkeys = document.querySelectorAll(".settings-pwrup-key")
    const resolutions = document.getElementsByClassName(
      "specific-resolution-div"
    )
    const inputs = document.getElementsByClassName("settings-inputs")
    for (let i = 0; i < hotkeys.length; i++) {
      hotkeys[i].removeEventListener("click", hotkeysEventListenerArray[i])
    }
    for (let i = 0; i < resolutions.length; i++) {
      resolutions[i].removeEventListener(
        "click",
        resolutionEventListenerArray[i]
      )
    }
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].removeEventListener("click", inputsEventListenerArray[i])
    }
    settingsDivContainer.style.top = "-100%"
    settingsReturnButton.style.top = "-30%"
    setTimeout(() => {
      settingsDivContainer.remove()
      settingsReturnButton.remove()
    }, 500)
    showUI()
  }
  createAccountElement.addEventListener("click", closeSettings)
  container.appendChild(settingsReturnButton)

  // appending to settings section
  settingsSection.appendChild(soundFxDiv)
  settingsSection.appendChild(musicDiv)
  settingsSection.appendChild(resolutionDiv)
  settingsSection.appendChild(keyBindsDiv)

  settingsDivContainer.appendChild(settingsSection)
  settingsDivContainer.appendChild(infoSection)
  container.appendChild(settingsDivContainer)
  setTimeout(() => {
    settingsDivContainer.style.top = "50%"
    settingsReturnButton.style.top = "calc(100% - 7.5% - 5%)" // 100% (full container height) - 7.5% (height of the button) - 5% (desired bottom offset)
  }, 10)
}
function showLoadout() {
  if (popUpExists) {
    return
  }
  if (!isLogged) {
    popUper("please log in or play as guest to use this option")
    return
  }
  hideUI(true)
  // playSound(soundFXvolume , '/sounds/swooz.wav');
  const bottleUsedBefore = user.bottleSelected
  const bottleFlipActiveBefore = user.userPowerups[0].active
  const superShotsActiveBefore = user.userPowerups[1].active
  const shieldActiveBefore = user.userPowerups[2].active

  let createAccountElement = document.querySelector(".log-out-text")
  const bottlesEventListenersArray = []
  const powerupsEventListenersArray = []

  const loadoutDivContainer = document.createElement("div")
  const loadoutHeader = document.createElement("span")
  loadoutHeader.innerText = "loadout"
  loadoutDivContainer.className = "loadout-div-container"
  loadoutHeader.className = "loadout-header"
  const userDataText = document.createElement("span")
  const bottlesText = document.createElement("span")
  const powerupsText = document.createElement("span")
  userDataText.className = "loadout-sub-headers"
  bottlesText.className = "loadout-sub-headers"
  powerupsText.className = "loadout-sub-headers"
  userDataText.innerText = "user data"
  bottlesText.innerText = "bottles"
  powerupsText.innerText = "powerups"
  userDataText.style.left = "25%"
  userDataText.style.top = "9%"
  powerupsText.style.left = "72.5%"
  powerupsText.style.top = "54%"
  bottlesText.style.left = "72.5%"
  bottlesText.style.top = "9%"

  loadoutDivContainer.appendChild(loadoutHeader)
  loadoutDivContainer.appendChild(userDataText)
  loadoutDivContainer.appendChild(bottlesText)
  loadoutDivContainer.appendChild(powerupsText)

  const userDataDiv = document.createElement("div")
  const bottlesDiv = document.createElement("div")
  const bottlesDivGrid = document.createElement("div")
  const powerupsDiv = document.createElement("div")
  userDataDiv.className = "loadout-userdata-div"
  bottlesDiv.className = "loadout-bottles-div"
  bottlesDivGrid.className = "loadout-bottles-div-grid"
  powerupsDiv.className = "loadout-powerups-div"

  // bottles section
  let loopIterations
  if (user.bottlesOwned.length % 2 === 1) {
    loopIterations = user.bottlesOwned.length + 1
  } else if (user.bottlesOwned.length == 2) {
    loopIterations = 4
  } else {
    loopIterations = user.bottlesOwned.length
  }

  function selectBottle(
    bottleName,
    selectButton,
    selectText,
    bottleSrc,
    shotSrc
  ) {
    if (user.bottleSelected == bottleName) {
      return
    }
    user.bottleSelected = bottleName
    // reset existing selected div
    const selectedBottleDivs = document.querySelectorAll(
      ".loadout-selected-bottle-div"
    )
    selectedBottleDivs.forEach((div) => {
      const imgElement = div.querySelector("img")
      if (imgElement) {
        div.removeChild(imgElement)
      }
      const spanElement = div.querySelector("span")
      if (spanElement) {
        spanElement.innerText = "select"
      }
      bottle.img.src = bottleSrc
      shotsSRC = shotSrc
      div.classList.remove("loadout-selected-bottle-div")
      div.classList.add("loadout-select-bottle-div")
    })
    // classes for newly selected div
    selectButton.classList.remove("loadout-select-bottle-div")
    selectButton.classList.add("loadout-selected-bottle-div")
    selectText.innerText = "selected"
    const selectedImg = document.createElement("img")
    selectedImg.src = "https://i.ibb.co/L0hZ44d/v-2.png"
    selectButton.insertBefore(selectedImg, selectText)
  }
  function loadoutOpenShop() {
    closeLoadout()
    showShop()
  }
  for (let i = 0; i < loopIterations; i++) {
    if (i >= user.bottlesOwned.length) {
      const newGridCell = document.createElement("div")
      const shopImg = document.createElement("img")
      const visitShopText = document.createElement("span")

      shopImg.src = "https://i.ibb.co/bX4QVm6/shopping-cart.png"
      visitShopText.innerText = "visit shop"

      newGridCell.classList.add(
        "loadout-bottles-grid-cell",
        "loadout-bottles-shop-cell"
      )
      shopImg.className = "loadout-bottles-shop-img"
      visitShopText.className = "loadout-bottles-shop-text"
      newGridCell.addEventListener("click", loadoutOpenShop)
      newGridCell.appendChild(shopImg)
      newGridCell.appendChild(visitShopText)
      bottlesDivGrid.appendChild(newGridCell)
      continue
    }
    const newGridCell = document.createElement("div")
    newGridCell.className = "loadout-bottles-grid-cell"

    const newBottleImg = document.createElement("img")
    const newBottlePlatform = document.createElement("img")
    const newbottleName = document.createElement("span")
    newBottleImg.src = user.bottlesOwned[i].src
    newBottlePlatform.src = "https://i.ibb.co/41rFf7w/blue-Scale.png"
    newbottleName.innerText = user.bottlesOwned[i].name
    const selectDiv = document.createElement("div")
    const selectDivText = document.createElement("span")

    newBottleImg.className = "loadout-bottle-img"
    newBottlePlatform.className = "loadout-bottle-platform"
    newbottleName.className = "loadout-bottle-name"
    if (user.bottlesOwned[i].name == user.bottleSelected) {
      const selectedImg = document.createElement("img")
      selectDivText.innerText = "selected"
      selectDiv.className = "loadout-selected-bottle-div"
      selectedImg.src = "https://i.ibb.co/L0hZ44d/v-2.png"

      selectDiv.appendChild(selectedImg)
    } else {
      selectDivText.innerText = "select"
      selectDiv.className = "loadout-select-bottle-div"
    }
    const bottleEventListener = () =>
      selectBottle(
        user.bottlesOwned[i].name,
        selectDiv,
        selectDivText,
        user.bottlesOwned[i].realSrc,
        user.bottlesOwned[i].shotSrc
      )
    bottlesEventListenersArray.push(bottleEventListener)
    selectDiv.addEventListener("click", bottleEventListener)

    selectDiv.appendChild(selectDivText)
    newGridCell.appendChild(newBottleImg)
    newGridCell.appendChild(newBottlePlatform)
    newGridCell.appendChild(newbottleName)
    newGridCell.appendChild(selectDiv)
    bottlesDivGrid.appendChild(newGridCell)
  }
  bottlesDiv.appendChild(bottlesDivGrid)

  //powerups section
  const powerupsGrid = document.createElement("div")
  powerupsGrid.className = "loadout-powerup-grid"

  function powerupActivation(powerupName, sliderDiv, sliderO, theText) {
    const powerup = user.userPowerups.find(
      (powerup) => powerup.name === powerupName
    )
    if (!powerup) {
      popUper("error finding the powerup")
      return
    }
    if (powerup.owned == 0) {
      popUper(
        "cant activate " + powerup.name + " because you dont have the powerup"
      )
      return
    }
    //  playSound(soundFXvolume * 0.5 , '/sounds/selecter.wav');
    if (powerup.active) {
      powerup.active = false
      sliderDiv.style.background = "#192B32"
      sliderO.style.left = "2.5%"
      sliderO.style.background = "#959595"
      theText.innerText = "inactive"
      theText.style.color = "#FFBABA"
    } else {
      powerup.active = true
      sliderDiv.style.background = "#1C7293"
      sliderO.style.left = "calc(91% - 1vmin)"
      sliderO.style.background = "#FFFFFF"
      theText.innerText = "active"
      theText.style.color = "#A5CEDE"
    }
  }
  for (let i = 0; i < user.userPowerups.length; i++) {
    const newPowerupCell = document.createElement("div")
    const powerupName = document.createElement("span")
    const powerupImg = document.createElement("img")
    const powerupOwnedDiv = document.createElement("div")
    const powerupHotkey = document.createElement("span")
    const powerupActivateDiv = document.createElement("div")
    const powerupActivateDivSlider = document.createElement("div")
    const activeText = document.createElement("span")

    powerupName.innerText = user.userPowerups[i].name
    powerupImg.src = user.userPowerups[i].src
    powerupOwnedDiv.innerText = user.userPowerups[i].owned
    powerupHotkey.innerText = "hotkey: " + user.userPowerups[i].hotkey
    if (user.userPowerups[i].active == false) {
      activeText.innerText = "inactive"
      activeText.style.color = "#FFBABA"
      powerupActivateDiv.style.background = "#192B32"
      powerupActivateDivSlider.style.left = "2.5%"
      powerupActivateDivSlider.style.background = "#959595"
    } else {
      activeText.innerText = "active"
      activeText.style.color = "#A5CEDE"
      powerupActivateDiv.style.background = "#1C7293"
      powerupActivateDivSlider.style.left = "calc(91% - 1vmin)"
      powerupActivateDivSlider.style.background = "#FFFFFF"
    }
    const powerupEventListener = () =>
      powerupActivation(
        user.userPowerups[i].name,
        powerupActivateDiv,
        powerupActivateDivSlider,
        activeText
      )
    powerupsEventListenersArray.push(powerupEventListener)
    powerupActivateDiv.addEventListener("click", powerupEventListener)

    newPowerupCell.className = "loadout-powerup-cell"
    powerupName.className = "loadout-powerup-name"
    powerupImg.className = "loadout-powerup-img"
    powerupOwnedDiv.className = "loadout-powerup-owned"
    powerupHotkey.className = "loadout-powerupHotkey"
    powerupActivateDiv.className = "loadout-activate-div"
    powerupActivateDivSlider.className = "loadout-activate-slider"
    activeText.className = "loadout-active-text"

    powerupActivateDiv.appendChild(powerupActivateDivSlider)
    newPowerupCell.appendChild(powerupName)
    newPowerupCell.appendChild(powerupImg)
    newPowerupCell.appendChild(powerupOwnedDiv)
    newPowerupCell.appendChild(powerupHotkey)
    newPowerupCell.appendChild(powerupActivateDiv)
    newPowerupCell.appendChild(activeText)

    powerupsGrid.appendChild(newPowerupCell)
  }
  powerupsDiv.appendChild(powerupsGrid)

  // user data section
  function loadoutCreateAccount() {
    closeLoadout()
    showSignUp()
  }
  function loadoutChangePassword() {
    let confirmOldPass = document.createElement("input")
    let newPass = document.createElement("input")
    let confirmButton = document.createElement("div")
    let cancelButton = document.createElement("div")
    confirmOldPass.type = "password"
    newPass.type = "password"
    confirmOldPass.placeholder = "current password"
    newPass.placeholder = "new password"
    newPass.className = "loadout-password-buttons"
    confirmOldPass.className = "loadout-password-buttons"
    confirmButton.className = "loadout-data-buttons"
    cancelButton.className = "loadout-data-buttons"

    confirmButton.style.left = "92.5%"
    confirmButton.style.top = "10%"
    cancelButton.style.left = "92.5%"
    cancelButton.style.top = "22.5%"
    confirmButton.style.width = "5%"
    cancelButton.style.width = "5%"

    newPass.style.left = "60%"
    newPass.style.top = "10%"
    confirmOldPass.style.left = "60%"
    confirmOldPass.style.top = "22.5%"
    confirmOldPass.style.opacity = "0"
    newPass.style.opacity = "0"

    let userDataLoadoutDiv = document.querySelector(".loadout-userdata-div")
    userDataLoadoutDiv.appendChild(confirmOldPass)
    userDataLoadoutDiv.appendChild(newPass)
    userDataLoadoutDiv.appendChild(confirmButton)
    userDataLoadoutDiv.appendChild(cancelButton)

    let elements = document.getElementsByClassName("loadout-data-buttons")
    for (let i = 0; i < elements.length; i++) {
      elements[i].style.opacity = "0"
    }
    setTimeout(() => {
      confirmButton.style.opacity = "1"
      cancelButton.style.opacity = "1"
      newPass.style.opacity = "1"
      confirmOldPass.style.opacity = "1"
    }, 10)
  }
  function loadoutChangeEmail() {
    popUper("pressed change email")
  }
  const usernameText = document.createElement("span")
  const mailText = document.createElement("span")
  const gamesPlayedText = document.createElement("span")
  const accuracyText = document.createElement("span")
  const highscoreText = document.createElement("span")
  const coinsText = document.createElement("span")
  const changePWdiv = document.createElement("div")
  const changeMailDiv = document.createElement("div")
  const username = document.createElement("span")
  const mail = document.createElement("span")
  const gamesPlayed = document.createElement("span")
  const accuracy = document.createElement("span")
  const highscore = document.createElement("span")
  const coins = document.createElement("span")

  changePWdiv.className = "loadout-data-buttons"
  changeMailDiv.className = "loadout-data-buttons"

  usernameText.innerText = "username"
  mailText.innerText = "mail"
  gamesPlayedText.innerText = "games played"
  accuracyText.innerText = "accuracy"
  highscoreText.innerText = "highscore"
  coinsText.innerText = "coins"
  if (user.isGuest) {
    changePWdiv.innerText = "create account"
    changePWdiv.style.height = "20%"
    changePWdiv.style.borderRadius = "20px"
    changeMailDiv.style.display = "none"
    changePWdiv.addEventListener("click", loadoutCreateAccount)
  } else {
    changePWdiv.innerText = "change password"
    changeMailDiv.innerText = "change mail"
    changePWdiv.addEventListener("click", loadoutChangePassword)
    changeMailDiv.addEventListener("click", loadoutChangeEmail)
  }

  let theAccuracy = user.totalShots
    ? ((user.totalHits / user.totalShots) * 100).toFixed(2)
    : "0.00"

  username.innerText = user.userName
  mail.innerText = user.mail
  gamesPlayed.innerText = user.gamesPlayed
  accuracy.innerText = theAccuracy + "%"
  highscore.innerText = user.highScore
  coins.innerText = user.coins

  const elements = [
    { el: usernameText, top: "10%", left: "10%" },
    { el: username, top: "12.5%", left: "10%" },
    { el: mailText, top: "22.5%", left: "10%" },
    { el: mail, top: "25%", left: "10%" },
    { el: gamesPlayedText, top: "40%", left: "10%" },
    { el: gamesPlayed, top: "42.5%", left: "10%" },
    { el: accuracyText, top: "52.5%", left: "10%" },
    { el: accuracy, top: "55%", left: "10%" },
    { el: changePWdiv, top: "10%", left: "60%" },
    { el: changeMailDiv, top: "22.5%", left: "60%" },
    { el: coinsText, top: "40%", left: "60%" },
    { el: coins, top: "42.5%", left: "60%" },
    { el: highscoreText, top: "52.5%", left: "60%" },
    { el: highscore, top: "55%", left: "60%" },
  ]

  elements.forEach(({ el, top, left }) => {
    el.style.position = "absolute"
    el.style.top = top
    el.style.left = left
    userDataDiv.appendChild(el)
  })
  usernameText.style.fontSize = "0.75em"
  usernameText.style.marginBottom = "0.25em"
  mailText.style.fontSize = "0.75em"
  mailText.style.marginBottom = "0.25em"
  gamesPlayedText.style.fontSize = "0.75em"
  gamesPlayedText.style.marginBottom = "0.25em"
  accuracyText.style.fontSize = "0.75em"
  accuracyText.style.marginBottom = "0.25em"
  highscoreText.style.fontSize = "0.75em"
  highscoreText.style.marginBottom = "0.25em"
  coinsText.style.fontSize = "0.75em"
  coinsText.style.marginBottom = "0.25em"

  username.style.fontSize = "1.5em"
  mail.style.fontSize = "1.5em"
  gamesPlayed.style.fontSize = "1.5em"
  accuracy.style.fontSize = "1.5em"
  highscore.style.fontSize = "1.5em"
  coins.style.fontSize = "1.5em"

  username.style.marginBottom = "1em"
  mail.style.marginBottom = "1em"
  gamesPlayed.style.marginBottom = "1em"
  accuracy.style.marginBottom = "1em"

  loadoutDivContainer.appendChild(userDataDiv)
  loadoutDivContainer.appendChild(bottlesDiv)
  loadoutDivContainer.appendChild(powerupsDiv)

  //return button
  const loadoutReturnButton = createReturnHomeButton()
  loadoutReturnButton.style.position = "absolute"
  loadoutReturnButton.style.removeProperty("top")
  loadoutReturnButton.style.left = "50%"
  loadoutReturnButton.style.top = "-30%"
  loadoutReturnButton.style.transform = "translateX(-50%)"
  loadoutReturnButton.addEventListener("click", closeLoadout)

  function closeLoadout() {
    if (
      user.bottleSelected != bottleUsedBefore ||
      user.userPowerups[0].active != bottleFlipActiveBefore ||
      user.userPowerups[1].active != superShotsActiveBefore ||
      user.userPowerups[2].active != shieldActiveBefore
    ) {
      const token = user.token
      const newData = {
        bottleSelected: user.bottleSelected,
        bottleFlipActive: user.userPowerups[0].active,
        superShotsActive: user.userPowerups[1].active,
        shieldActive: user.userPowerups[2].active,
      }
      fetch("http://localhost:3000/api/game/saveloadout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ newData }),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("succesfully saved loadout data")
        })
        .catch((error) => {
          console.error(error) // Handle any errors
        })
    }

    loadoutReturnButton.removeEventListener("click", closeLoadout)
    createAccountElement.removeEventListener("click", closeLoadout)
    changePWdiv.removeEventListener("click", loadoutCreateAccount)
    changePWdiv.removeEventListener("click", loadoutChangePassword)
    changeMailDiv.removeEventListener("click", loadoutChangeEmail)

    const bottles = document.querySelectorAll(
      ".loadout-select-bottle-div, .loadout-selected-bottle-div"
    )
    const powerups = document.getElementsByClassName("loadout-activate-div")
    const shopCells = document.getElementsByClassName(
      "loadout-bottles-shop-cell"
    )

    for (let i = 0; i < bottles.length; i++) {
      bottles[i].removeEventListener("click", bottlesEventListenersArray[i])
    }
    for (let i = 0; i < powerups.length; i++) {
      powerups[i].removeEventListener("click", powerupsEventListenersArray[i])
    }
    for (let i = 0; i < shopCells.length; i++) {
      shopCells[i].removeEventListener("click", loadoutOpenShop)
    }

    loadoutDivContainer.style.top = "-100%"
    loadoutReturnButton.style.top = "-30%"
    setTimeout(() => {
      loadoutDivContainer.remove()
      loadoutReturnButton.remove()
    }, 500)
    showUI()
  }
  createAccountElement.addEventListener("click", closeLoadout)
  container.appendChild(loadoutReturnButton)

  loadoutDivContainer.style.top = "-100%"
  container.appendChild(loadoutDivContainer)
  setTimeout(() => {
    loadoutDivContainer.style.top = "50%"
    loadoutReturnButton.style.top = "calc(100% - 7.5% - 5%)" // 100% (full container height) - 7.5% (height of the button) - 5% (desired bottom offset)
  }, 10)
}
function showMissions() {
  if (popUpExists) {
    return
  }
  if (!isLogged) {
    popUper("please log in or play as guest to use this option")
    return
  }
  hideUI(true)
  //   playSound(soundFXvolume , '/sounds/swooz.wav');
  let createAccountElement = document.querySelector(".log-out-text")
  const claimRewardEventListeners = []
  const missionsDivContainer = document.createElement("div")
  const missionsHeader = document.createElement("span")
  missionsHeader.innerText = "missions"
  missionsDivContainer.className = "missions-div-container"
  missionsHeader.className = "loadout-header"
  missionsDivContainer.appendChild(missionsHeader)

  const divForTable = document.createElement("div")
  const missionsTable = document.createElement("table")
  divForTable.className = "missions-div-table"
  missionsTable.className = "missions-table"
  divForTable.appendChild(missionsTable)

  function claimRewardFunc(theMission, theButtonDiv, theTD) {
    theMission.status = "completed"
    theButtonDiv.style.opacity = "0"
    theTD.innerText = "completed"
    theTD.style.color = "#FFFFFF"
    user.coins = user.coins + theMission.prize
    const theMissionText = theMission.missionText
    const token = user.token
    fetch("http://localhost:3000/api/game/missionreward", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ theMissionText }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("succesfully claimed mission reward")
      })
      .catch((error) => {
        console.error(error) // Handle any errors
      })
  }
  for (let i = 0; i < user.userMissions.length; i++) {
    const newTR = document.createElement("tr")
    const TDforName = document.createElement("td")
    const TDforPrize = document.createElement("td")
    const prizeCoinImg = document.createElement("img")
    const prizeCoinText = document.createElement("span")
    const TDforStatus = document.createElement("td")
    TDforName.style.width = "55%"
    TDforPrize.style.width = "25%"
    TDforStatus.style.width = "20%"
    TDforName.style.fontSize = "1.5em"
    TDforPrize.style.fontSize = "1.5em"
    TDforStatus.className = "missions-center-td"
    prizeCoinImg.className = "missions-coin-img"
    prizeCoinText.className = "missions-coin-text"

    TDforName.innerText = user.userMissions[i].missionText
    prizeCoinText.innerText = user.userMissions[i].prize
    prizeCoinImg.src = "https://i.ibb.co/Mnrrzgg/dollar.png"
    TDforPrize.appendChild(prizeCoinImg)
    TDforPrize.appendChild(prizeCoinText)
    if (user.userMissions[i].status == "claim reward") {
      const divForReward = document.createElement("div")
      divForReward.innerText = user.userMissions[i].status
      divForReward.className = "missions-reward-div"

      const claimRewardEventListener = () =>
        claimRewardFunc(user.userMissions[i], divForReward, TDforStatus)
      claimRewardEventListeners.push(claimRewardEventListener)
      divForReward.addEventListener("click", claimRewardEventListener)

      TDforStatus.appendChild(divForReward)
    } else if (user.userMissions[i].status == "completed") {
      TDforStatus.innerText = user.userMissions[i].status
      TDforStatus.style.color = "#FFFFFF"
    } else if (user.userMissions[i].status == "in progress") {
      TDforStatus.style.color = "#7DC6E2"
      TDforStatus.innerText = user.userMissions[i].status
    }
    newTR.appendChild(TDforName)
    newTR.appendChild(TDforPrize)
    newTR.appendChild(TDforStatus)
    missionsTable.appendChild(newTR)
  }
  missionsDivContainer.appendChild(divForTable)

  //return button
  const missionsReturnButton = createReturnHomeButton()
  missionsReturnButton.style.position = "absolute"
  missionsReturnButton.style.removeProperty("top")
  missionsReturnButton.style.left = "50%"
  missionsReturnButton.style.top = "-30%"
  missionsReturnButton.style.transform = "translateX(-50%)"
  missionsReturnButton.addEventListener("click", closeMissions)

  function closeMissions() {
    missionsReturnButton.removeEventListener("click", closeMissions)
    createAccountElement.removeEventListener("click", closeMissions)

    const rewardDivs = document.getElementsByClassName("missions-reward-div")

    for (let i = 0; i < rewardDivs.length; i++) {
      rewardDivs[i].removeEventListener("click", claimRewardEventListeners[i])
    }

    missionsDivContainer.style.top = "-100%"
    missionsReturnButton.style.top = "-30%"
    setTimeout(() => {
      missionsDivContainer.remove()
      missionsReturnButton.remove()
    }, 500)
    showUI()
  }
  createAccountElement.addEventListener("click", closeMissions)
  container.appendChild(missionsReturnButton)

  missionsDivContainer.style.top = "-100%"
  container.appendChild(missionsDivContainer)
  setTimeout(() => {
    missionsDivContainer.style.top = "50%"
    missionsReturnButton.style.top = "calc(100% - 7.5% - 5%)" // 100% (full container height) - 7.5% (height of the button) - 5% (desired bottom offset)
  }, 10)
}

// Make all functions globally accessible
window.pauseGame = pauseGame
window.createGuest = createGuest
window.loggedIn = loggedIn
window.showShop = showShop
window.showLoadout = showLoadout
window.showMissions = showMissions
window.handleMuteClick = handleMuteClick
window.showSettings = showSettings
window.backAfterGameOver = backAfterGameOver
window.continueGame = continueGame
window.quitGame = quitGame
window.showSignUp = showSignUp
window.signUp = signUp
window.logIn = logIn
