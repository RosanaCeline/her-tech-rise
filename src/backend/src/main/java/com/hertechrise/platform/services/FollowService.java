package com.hertechrise.platform.services;

import com.hertechrise.platform.data.dto.request.FollowRequestDTO;
import com.hertechrise.platform.data.dto.request.UnfollowRequestDTO;
import com.hertechrise.platform.data.dto.response.FollowResponseDTO;
import com.hertechrise.platform.data.dto.response.FollowerCountResponseDTO;
import com.hertechrise.platform.data.dto.response.VerifyFollowResponseDTO;
import com.hertechrise.platform.exception.*;
import com.hertechrise.platform.model.FollowRelationship;
import com.hertechrise.platform.model.User;
import com.hertechrise.platform.repository.FollowRelationshipRepository;
import com.hertechrise.platform.repository.UserRepository;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.PathVariable;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class FollowService {

    private final UserRepository userRepository;
    private final FollowRelationshipRepository followRepository;

    public FollowResponseDTO follow(FollowRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        User following = userRepository.findById(request.id())
                .orElseThrow(UserNotFoundException::new);

        if (loggedUser.getId().equals(following.getId())) {
            throw new SelfFollowException();
        }

        boolean exists = followRepository.existsByFollowerAndFollowing(loggedUser, following);
        if (exists) {
            throw new AlreadyFollowingException();
        }

        FollowRelationship follow = new FollowRelationship();
        follow.setFollower(loggedUser);
        follow.setFollowing(following);
        followRepository.save(follow);

        return new FollowResponseDTO(
                follow.getId(),
                follow.getFollower().getId(),
                follow.getFollowing().getId(),
                follow.getFollowedAt()
        );
    }

    public void unfollow(UnfollowRequestDTO request) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        Long followingId = request.id();

        if (loggedUser.getId().equals(followingId)) {
            throw new SelfUnfollowException();
        }

        User follower  = userRepository.findById(loggedUser.getId())
                .orElseThrow(UserNotFoundException::new);

        User following = userRepository.findById(followingId)
                .orElseThrow(UserNotFoundException::new);

        boolean exists = followRepository.existsByFollowerAndFollowing(loggedUser, following);
        if (!exists) {
            throw new FollowNotFoundException();
        }

        followRepository.deleteByFollowerAndFollowing(follower, following);
    }

    public VerifyFollowResponseDTO verifyFollow(Long id){
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        if (loggedUser.getId().equals(id)) {
            throw new VerifySelfFollowException();
        }

        User targetUser  = userRepository.findById(id)
                .orElseThrow(UserNotFoundException::new);

        boolean exists = followRepository.existsByFollowerAndFollowing(loggedUser, targetUser);
        return new VerifyFollowResponseDTO(exists);
    }

    @Transactional(readOnly = true)
    public List<FollowResponseDTO> listFollowing() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        return followRepository.findAllByFollower(loggedUser)
                .stream()
                .map(this::toDto)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<FollowResponseDTO> listFollowers() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User loggedUser = (User) auth.getPrincipal();

        return followRepository.findAllByFollowing(loggedUser)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public long countFollowers(Long userId) {
        return followRepository.countByFollowing_Id(userId);
    }

    public long countFollowing(Long userId) {
        return followRepository.countByFollower_Id(userId);
    }

    public FollowerCountResponseDTO getFollowerStats(Long userId) {
        long followers = countFollowers(userId);
        long following = countFollowing(userId);
        return new FollowerCountResponseDTO(followers, following);
    }

    @Transactional(readOnly = true)
    public Map<Long, Long> countFollowersListing(List<Long> userIds) {
        List<Object[]> result = followRepository.countFollowersForUsers(userIds);
        return result.stream().collect(Collectors.toMap(
                row -> (Long) row[0],
                row -> (Long) row[1]
        ));
    }


    private FollowResponseDTO toDto(FollowRelationship fr) {
        return new FollowResponseDTO(
                fr.getId(),
                fr.getFollower().getId(),
                fr.getFollowing().getId(),
                fr.getFollowedAt()
        );
    }
}
